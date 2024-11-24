import config from '../../../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요
// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import { useAuth } from '../../contexts/AuthContext';
import styles from './NewItem.module.css';  // CSS Modules import

function NewItem() {
  const { isAuthenticated, user } = useAuth();


  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [desiredMerchandise, setDesiredMerchandise] = useState('');
  const [imageFile, setImageFile] = useState(null); // 이미지 파일을 위한 상태

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated || !user) {
  //     alert("You need to be logged in to initiate a chat.");
  //     return;
  //   }
  //   // useEffect 내부에서 async 함수를 정의
  //   const fetchUserId = async () => {
  //     try {
  //       const currentUserEmail = user.email;
  
  //       // 이메일을 쿼리 파라미터로 전달하여 사용자 ID를 가져옵니다.
  //       const currentUserIdResponse = await axios.get(`${config.baseUrl}/api/users/getId`, {
  //         params: {
  //           email: currentUserEmail
  //         }
  //       });
  
  //       const currentUserId = currentUserIdResponse.data.userId;
  
  //       // 사용자 ID를 상태로 설정
  //       setUserId(currentUserId);
  //     } catch (error) {
  //       console.error("Error fetching user ID:", error);
  //     }
  //   };
  
  //   // 비동기 함수 호출
  //   fetchUserId();
  // }, [user]); // user가 변경될 때마다 실행

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file); // 선택한 이미지를 상태에 저장
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${config.baseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImagePath(response.data.imagePath); // 서버 응답에서 이미지 경로 설정
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    if (!isAuthenticated || !user) {
      alert("You need to be logged in to initiate a chat.");
      return;
    }

    e.preventDefault();
    const currentUserEmail = user.email;
  
    // 이메일을 쿼리 파라미터로 전달하여 사용자 ID를 가져옵니다.
    const currentUserIdResponse = await axios.get(`${config.baseUrl}/api/users/getId`, {
    params: {
      email: currentUserEmail
    }
    });
    const currentUserId = currentUserIdResponse.data.userId;
    const newItem = {
      name,
      description,
      price,
      userId : currentUserId,
      imagePath,
      desiredMerchandise,
    };

    await axios.post(`${config.baseUrl}/api/merchandise/register`, newItem)
      .then(response => {
        if (response.data.success) {
          navigate('/items');
        } else {
          alert('Failed to create new item');
        }
      });
  };

  return (
    <div>
    <NavBar />

    <div className={styles.chatContainer}>
      <h1>Register New Item</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <br />
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <br />
        {/* <label>
          User ID:
          <input type="number" value={userId} readOnly />
        </label> */}
        <label>
          Image Path:
          {/* <input type="text" value={imagePath} onChange={(e) => setImagePath(e.target.value)} required /> */}
          <input type="file" onChange={handleImageUpload} required />

        </label>
        <br />
        <label>
          Desired Merchandise:
          <input type="text" value={desiredMerchandise} onChange={(e) => setDesiredMerchandise(e.target.value)} required />
        </label>
        <br />
        <div className={styles.wrapButton} >
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default NewItem;
