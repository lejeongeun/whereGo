import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 및 토큰 확인
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <div className="logo">어디GO</div>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          {/* 메인 메뉴 항목들 */}
          <li className="nav-item">
            <Link to="/schedule" className="nav-link" onClick={() => setMenuOpen(false)}>
              일정리스트
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/weather" className="nav-link" onClick={() => setMenuOpen(false)}>
              나라별 날씨
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exchange" className="nav-link" onClick={() => setMenuOpen(false)}>
              나라별 환율
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/checklist" className="nav-link" onClick={() => setMenuOpen(false)}>
              체크리스트
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/community" className="nav-link" onClick={() => setMenuOpen(false)}>
              커뮤니티
            </Link>
          </li>
          
          {/* 로그인/회원가입 또는 마이페이지/로그아웃 */}
          <li className="nav-item member-section">
            <div className="auth-links">
              {isLoggedIn ? (
                <>
                  <Link to="/mypage" className="auth-link" onClick={() => setMenuOpen(false)}>
                    mypage
                  </Link>
                  <span className="auth-link" onClick={handleLogout}>
                    logout
                  </span>
                </>
              ) : (
                <>
                  <span className="auth-link" onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}>
                    login
                  </span>
                  <span className="auth-link" onClick={() => {
                    navigate('/signup');
                    setMenuOpen(false);
                  }}>
                    join
                  </span>
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;