import config from '../../../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`${config.baseUrl}/api/merchandise/${id}`)
      .then(response => {
        if (response.data.success) {
          setItem(response.data.merchandise);
        } else {
          alert('Failed to fetch item details');
        }
      });
  }, [id]);


  const handleChatInitiation = async () => {
    if (!isAuthenticated || !user) {
      alert("You need to be logged in to initiate a chat.");
      return;
    }

    const currentUserEmail = user.email;
    // const currentUserId = await axios.get(`${config.baseUrl}/api/users/getId`);
    const currentUserIdResponse = await axios.get(`${config.baseUrl}/api/users/getId`, {
      params: {
        email: currentUserEmail
      }
    });
    const currentUserId = currentUserIdResponse.data.userId;
  
    // const roomName = `chat_${currentUserId}_${item.userId}`; // 방 이름은 두 사용자 ID 기반으로 생성
    const response = await axios.post(`${config.baseUrl}/api/chat/create-room`);
    const roomId = response.data.roomId;

    await axios.post(`${config.baseUrl}/api/chat/admin/setChatRoom`, {
      userId1: currentUserId,
      userId2: item.userId,
      roomName: roomId
    })
    .then(response => {
      if (response.data.message === 'Users successfully added to the room') {
        // 채팅방으로 이동
        navigate(`/chat/${roomId}`);
        // history.push(`/chat/${roomName}`);
      } else {
        alert('Failed to create or join the chat room');
      }
    })
    .catch(error => {
      console.error("There was an error initiating the chat!", error);
    });
  };


  if (!item) return <div>Loading...</div>;

  return (
    <div>
    <NavBar />


    <div>
      <h1>{item.name}</h1>
      <img src={item.imagePath} alt={item.name} style={{ width: '200px' }} />
      <p>Description: {item.description}</p>
      <p>Desired Merchandise: {item.desiredMerchandise}</p>
      <p>Price: ${item.price}</p>
      <p>User ID: {item.userId}</p>
      <p>Created At: {new Date(item.createdAt).toLocaleDateString()}</p>
      {/* 채팅 시작 버튼 */}
      <button onClick={handleChatInitiation}>
        Chat with User
      </button>
    </div>
    </div>
  );
}

export default ItemDetail;
