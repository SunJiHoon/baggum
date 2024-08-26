import config from '../../../config/dev';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import CategoryBar from '../CategoryBar/CategoryBar';

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
      <CategoryBar />
      <div>
        {/* <h1>Items</h1> */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '20px',
            padding: '0 40px', // 좌우에 20px 패딩을 추가
          }}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <img src={item.imagePath} alt={item.name} style={{ width: '100px' }} />
              <Link to={`/items/${item.id}`}>{item.name}</Link>
              <p>Desired Merchandise: {item.desiredMerchandise}</p>
            </div>
          ))}
        </div>
        <Link to="/items/new">Add New Item</Link>
      </div>
    </div>
  );
}

export default ItemsPage;
