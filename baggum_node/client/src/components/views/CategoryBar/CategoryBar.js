import React from 'react';
import { Link } from 'react-router-dom';

function CategoryBar() {
  // 카테고리 목록을 하드코딩 또는 prop으로 받아서 설정합니다.
  const categories = [
    { name: 'Wish List', path: '/wish-list' },
    { name: 'Newest', path: '/newest' },
    { name: 'Category1', path: '/category1' },
    { name: 'Category2', path: '/category2' },
    { name: 'Category3', path: '/category3' }
  ];

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '10px 0',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
      }}
    >
      {categories.map((category, index) => (
        <Link 
          key={index} 
          to={category.path} 
          style={{
            textDecoration: 'none',
            color: '#000',
            fontWeight: 'bold',
            padding: '5px 10px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}

export default CategoryBar;
