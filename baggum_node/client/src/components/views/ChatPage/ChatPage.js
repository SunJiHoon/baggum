import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import NavBar from '../NavBar/NavBar';
import config from '../../../config/dev'; // config import

//const socket = io('http://localhost:5000');
const socket = io(`${config.baseUrl}`);

// function ChatPage() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('message');
//     };
//   }, []);

//   const sendMessage = () => {
//     socket.emit('message', message);
//     setMessage('');
//   };

//   return (
//     <div>
//       <NavBar />
//       <h1>Chat Room</h1>
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyPress={(e) => {
//           if (e.key === 'Enter') sendMessage();
//         }}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default ChatPage;
