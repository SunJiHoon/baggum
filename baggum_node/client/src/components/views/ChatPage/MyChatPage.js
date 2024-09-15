import React, { useState, useEffect, useRef } from 'react';
// import './MyChatPage.module.css';
import styles from './MyChatPage.module.css';  // CSS Modules import
import NavBar from '../NavBar/NavBar';
import axios from 'axios';
import config from '../../../config/dev'; // config import

const MyChatPage = () => {
  // const messages = [
  //   { user: 'User 3', message: "안녕하세요! 등록하신 상품에 관심이 있습니다. 아직 구매 가능한가요?", time: '10:20 AM', unreadCount: 0 },
  //   { user: 'User 2', message: '안녕하세요! 네, 가격은 협상 가능합니다. 얼마를 제안하시겠습니까?', time: '12:00 PM', unreadCount: 1 },
  //   { user: 'User 1', message: '위치가 어디인가요?', time: '12:34 PM', unreadCount: 2 },
  // ];

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드에서 데이터를 받아오기 위한 GET 요청
    axios.get(`${config.baseUrl}/api/chat/read/chat/page`)  // 백엔드 API URL로 교체
      .then((response) => {
        setMessages(response.data); // 성공적으로 데이터를 가져오면 상태 업데이트
        setLoading(false);          // 로딩 상태 해제
      })
      .catch((err) => {
        setError(err.message);      // 에러 발생 시 에러 메시지 저장
        setLoading(false);          // 로딩 상태 해제
      });
  }, []);

  // 로딩 상태 처리
  if (loading) {
    return <p>Loading messages...</p>;
  }

  // 에러 상태 처리
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <NavBar />
      <div className={styles.chatContainer}>
        <span className={styles.chatHeader}></span>
        {messages.map((msg, index) => (
          <div key={index} className={styles.chatMessage}>
            <div className={styles.userInfo}>
              <img className={styles.userIcon} src="/images/profile.png" alt="User Icon" />
              <div className={styles.userDetails}>
                <span className={styles.userName}>{msg.user}</span>
                <span className={styles.messageText}>{msg.message}</span>
              </div>
              {msg.unreadCount > 0 && <span className={styles.unreadCount}>{msg.unreadCount}</span>}
            </div>
            <span className={styles.messageTime}>{msg.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyChatPage;
