import config from '../../../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';

function ItemDetail() {
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
    </div>
    </div>
  );
}

export default ItemDetail;
