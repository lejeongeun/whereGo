import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <div className="sidebar">
        <div className="logo">어디GO</div>
        <ul className="menu">
          <li><Link to="/schedule">일정리스트</Link></li>
          <li><Link to="/weather">나라별 날씨</Link></li>
          <li><Link to="/exchange">나라별 환율</Link></li>
          <li><Link to="/checklist">체크리스트</Link></li>
          <li><Link to="/community">커뮤니티</Link></li>
        </ul>
      </div>

        <div className="content-container">
          <div className="featured-image-container">
            <img src="/resources/img/effel.png" alt="파리 에펠탑" className="featured-image" />
          </div>
          
          <div className="popular-destinations">
            <h2>인기 여행지</h2>
            <div className="destinations-grid">
              <div className="destination-card">
                <img src="/resources/img/뽜리.jpg" alt="파리" className="featured-image" />
                <h3>파리</h3>
                <p>프랑스의 아름다운 수도</p>
              </div>
              <div className="destination-card">
                <img src="/resources/img/도쿄.jpg" alt="도쿄" className="featured-image" />
                <h3>도쿄</h3>
                <p>일본의 활기찬 도시</p>
              </div>
              <div className="destination-card">
                <img src="/resources/img/뉴욕.jpg" alt="뉴욕" className="featured-image" />
                <h3>뉴욕</h3>
                <p>잠들지 않는 도시</p>
              </div>
              <div className="destination-card">
                <img src="/resources/img/로마.jpg" alt="로마" className="featured-image" />
                <h3>로마</h3>
                <p>이탈리아의 역사적인 도시</p>
              </div>
            </div>
          </div>
          
          <div className="travel-tips">
            <h2>여행 팁</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h3>여행 준비물</h3>
                <p>여행 전 꼭 챙겨야 할 필수 아이템들</p>
                <Link to="/checklist" className="tip-link">자세히 보기</Link>
              </div>
              <div className="tip-card">
                <h3>환전 팁</h3>
                <p>가장 좋은 환율을 얻는 방법</p>
                <Link to="/currency" className="tip-link">자세히 보기</Link>
              </div>
              <div className="tip-card">
                <h3>안전 여행</h3>
                <p>해외여행 시 알아야 할 안전 수칙</p>
                <Link to="/safety" className="tip-link">자세히 보기</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}

export default HomePage;