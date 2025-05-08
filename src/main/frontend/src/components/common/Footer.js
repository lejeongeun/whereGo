import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // 페이지 이동과 동시에 스크롤을 최상단으로 올리는 함수
  const navigateAndScrollTop = (to) => {
    navigate(to);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">WhereGo</h3>
          <p className="footer-description">
            여행 일정 관리, 경비 계산, 체크리스트까지 한 곳에서 관리하세요.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24}/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter size={24}/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare size={24}/>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>둘러보기</h3>
          <div className="footer-links-container">
            <div className="footer-links-column">
              <ul className="footer-links">
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/')}>홈</span>
                </li>
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/schedule')}>여행 일정</span>
                </li>
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/weather')}>나라별 날씨</span>
                </li>
              </ul>
            </div>
            <div className="footer-links-column">
              <ul className="footer-links">
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/exchange')}>나라별 환율</span>
                </li>
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/checklist')}>체크리스트</span>
                </li>
                <li>
                  <span className="custom-link" onClick={() => navigateAndScrollTop('/community')}>커뮤니티</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} WhereGo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;