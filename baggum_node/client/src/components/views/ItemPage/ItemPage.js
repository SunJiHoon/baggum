import config from '../../../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';

function ItemsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${config.baseUrl}/api/merchandise`)
      .then(response => {
        if (response.data.success) {
          setItems(response.data.merchandiseList);
        } else {
          alert('Failed to fetch items');
        }
      });
  }, []);

  return (
    <div>
    <NavBar />


    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <img src={item.imagePath} alt={item.name} style={{ width: '100px' }} />
            <Link to={`/items/${item.id}`}>{item.name}</Link>
            <p>Desired Merchandise: {item.desiredMerchandise}</p>
          </li>
        ))}
      </ul>
      <Link to="/items/new">Add New Item</Link>
    </div>
    </div>
  );
}

export default ItemsPage;
