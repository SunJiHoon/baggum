import React from 'react';
import './MyChatPage.css';

const ChatBox = () => {
  const messages = [
    { user: 'User 3', message: "안녕하세요! 등록하신 상품에 관심이 있습니다. 아직 구매 가능한가요?", time: '10:20 AM', unreadCount: 0 },
    { user: 'User 2', message: '안녕하세요! 네, 가격은 협상 가능합니다. 얼마를 제안하시겠습니까?', time: '12:00 PM', unreadCount: 1 },
    { user: 'User 1', message: '위치가 어디인가요?', time: '12:34 PM', unreadCount: 2 },
  ];

  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div key={index} className="chat-message">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{msg.user}</span>
            {msg.unreadCount > 0 && <span className="unread-count">{msg.unreadCount}</span>}
          </div>
          <div className="message-content">
            <span className="message-text">{msg.message}</span>
            <span className="message-time">{msg.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyChatRoom;
