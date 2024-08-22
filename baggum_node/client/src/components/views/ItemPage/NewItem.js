import config from '../../../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';

function NewItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [desiredMerchandise, setDesiredMerchandise] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      name,
      description,
      price,
      userId,
      imagePath,
      desiredMerchandise,
    };

    axios.post(`${config.baseUrl}/api/merchandise/register`, newItem)
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

    <div>
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
        <label>
          User ID:
          <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </label>
        <br />
        <label>
          Image Path:
          <input type="text" value={imagePath} onChange={(e) => setImagePath(e.target.value)} required />
        </label>
        <br />
        <label>
          Desired Merchandise:
          <input type="text" value={desiredMerchandise} onChange={(e) => setDesiredMerchandise(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
    </div>
  );
}

export default NewItem;
