import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

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
          <ul className="footer-links">
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/trips">여행 일정</Link>
            </li>
            <li>
              <Link to="/expenses">경비 계산</Link>
            </li>
            <li>
              <Link to="/checklist">체크리스트</Link>
            </li>
            <li>
              <Link to="/community">커뮤니티</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>지원</h3>
          <ul className="footer-links">
            <li>
              <Link to="/faq">자주 묻는 질문</Link>
            </li>
            <li>
              <Link to="/contact">문의하기</Link>
            </li>
            <li>
              <Link to="/privacy">개인정보 처리방침</Link>
            </li>
            <li>
              <Link to="/terms">이용약관</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>뉴스레터 구독</h3>
          <p>최신 여행 정보와 프로모션을 받아보세요.</p>
          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="이메일 주소"
              required
            />
            <button type="submit" className="newsletter-button">
              구독
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} WhereGo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;