import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import NavBar from "../NavBar/NavBar";
import "./Room.css";

const socket = io("http://localhost:5000");

const Room = () => {
  const { roomId } = useParams(); // URL에서 roomId 추출
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("User1"); // 임시 username

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      // 특정 방에 참가
      socket.emit("joinRoom", { roomId });

      // 메시지 수신
      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
      socket.off("message");
      };
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const timeString = date.toLocaleTimeString("en-US", options);
    return timeString;
  };

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (message.trim()) {
      const timestamp = formatTime(new Date());
       socket.emit("message", { roomId, message, userName, timestamp });
      setMessages([
        ...messages,
        { message, userName, timestamp, isOwnMessage: true },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="chat-container">
        <div className="chat-NavBar">
          <span className="solar--arrow-up-outline"></span>
          <span className="chat-username">{userName}</span>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              className={`chat-message-container ${
                msg.isOwnMessage
                  ? "my-message-container"
                  : "your-message-container"
              }`}
              key={index}
            >
              {!msg.isOwnMessage && (
                <>
                  <div className="chat-message-username">
                    <img src="/profile.png" className="chat-message-profile" />
                    <span className="chat-message-username">
                      {msg.userName}
                    </span>
                  </div>
                  <div className="message-timestamp">
                    <div className="chat-message your-message">
                      {msg.message}
                    </div>
                    <span className="your-message-timestamp">
                      {msg.timestamp}
                    </span>
                  </div>
                </>
              )}
              {msg.isOwnMessage && (
                <>
                  <span className="chat-message-timestamp">{msg.timestamp}</span>
                  <div className="chat-message my-message">
                    {msg.message}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sendMessage-container">
        <span className="fluent--add-28-filled"></span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Room;
