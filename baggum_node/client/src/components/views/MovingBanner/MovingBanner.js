import React, { useState } from 'react';
import './MovingBanner.css';

const MovingBanner = () => {
  const images = [
    '/images/commercial/image1.png',
    '/images/commercial/image2.png',
    '/images/commercial/image3.png',
  ]; // 이미지 경로 배열

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="moving-banner">
      <button className="prev-button" onClick={handlePrevClick}>
        &#9664; {/* 왼쪽 화살표 */}
      </button>
      <img 
        src={images[currentImageIndex]} 
        alt={`Banner ${currentImageIndex + 1}`} 
        className="banner-image" 
      />
      <button className="next-button" onClick={handleNextClick}>
        &#9654; {/* 오른쪽 화살표 */}
      </button>
    </div>
  );
};

export default MovingBanner;
