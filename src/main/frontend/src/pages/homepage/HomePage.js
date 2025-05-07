import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import api from '../../api';

function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  
  // 이미지 경로 배열
  const images = Array.from({ length: 9 }, (_, i) => `/resources/img/homepage_img${i + 1}.png`);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    },5000); // 5초마다 이미지 변경

    return () => clearInterval(interval);
  }, [images.length]);

  // 수동 네비게이션 함수
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // 도시 카드 클릭 핸들러
  const handleDestinationClick = (cityName) => {
    // /schedule 페이지로 이동하면서 검색할 도시 이름 전달
    navigate('/schedule', { state: { searchCity: cityName } });
  };
  

  const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
      api.get('/community/list')
        .then(res => {
          const sorted = [...res.data].sort((a, b) =>
            (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount)
          );
          setPopularPosts(sorted.slice(0, 3));
        });
    }, []);

  return (
    <div className="home-page">
      <div className="content-container">
        <div className="featured-image-container">
          {/* 이미지 슬라이더 */}
          <div className="slider-container">
            {/* 이미지들 */}
            <div className="slides-wrapper">
              {images.map((src, index) => (
                <div 
                  key={index}
                  className={`slide ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img 
                    src={src} 
                    alt={`메인 이미지 ${index + 1}`} 
                    className="featured-image"
                  />
                </div>
              ))}
            </div>

            {/* 네비게이션 화살표 */}
            <button 
              onClick={goToPrevSlide}
              className="slider-nav-arrow prev-arrow"
              aria-label="이전 슬라이드"
            >
              &#10094;
            </button>
            <button 
              onClick={goToNextSlide}
              className="slider-nav-arrow next-arrow"
              aria-label="다음 슬라이드"
            >
              &#10095;
            </button>

            {/* 인디케이터 점들 */}
            <div className="slider-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="popular-destinations">
          <h2>인기 여행지</h2>
          <div className="destinations-grid">
            <div 
              className="destination-card" 
              onClick={() => handleDestinationClick('파리')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/resources/img/paris.jpg" alt="파리" />
              <h3>파리</h3>
              <p>프랑스의 아름다운 수도</p>
            </div>
            <div 
              className="destination-card" 
              onClick={() => handleDestinationClick('도쿄')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/resources/img/tokyo.jpg" alt="도쿄" />
              <h3>도쿄</h3>
              <p>일본의 활기찬 도시</p>
            </div>
            <div 
              className="destination-card" 
              onClick={() => handleDestinationClick('뉴욕')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/resources/img/newyork.jpg" alt="뉴욕" />
              <h3>뉴욕</h3>
              <p>잠들지 않는 도시</p>
            </div>
            <div 
              className="destination-card" 
              onClick={() => handleDestinationClick('로마')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/resources/img/rome.jpg" alt="로마" />
              <h3>로마</h3>
              <p>이탈리아의 역사적인 도시</p>
            </div>
          </div>
        </div>
        
        <div className="travel-tips">
          <h2>인기게시물</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>여행 준비물</h3>
              <p>여행 전 꼭 챙겨야 할 필수 아이템들</p>
              <Link to="/checklist" className="tip-link">자세히 보기</Link>
            </div>
            <div className="tip-card">
              <h3>환전 팁</h3>
              <p>정확한 환율을 실시간으로 찾아보기</p>
              <Link to="/exchange" className="tip-link">자세히 보기</Link>
            </div>

            {popularPosts.map((post) => (
              <Link to={`/community/${post.id}`} className="tip-card" key={post.id}>
                <h4 className="post-title">{post.title}</h4>
                <p className="post-preview">{post.content.slice(0, 50)}...</p>
              </Link>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;