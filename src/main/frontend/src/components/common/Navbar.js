import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
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
        <Link to="/" className="navbar-logo">
          어디GO
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              일정리스트
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/weather" className="nav-link" onClick={() => setMenuOpen(false)}>
              나라별 날씨
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/currency" className="nav-link" onClick={() => setMenuOpen(false)}>
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
          
          {isLoggedIn ? (
            <>
              <li className="nav-item profile-item">
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  마이페이지
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/auth" className="nav-link login-btn" onClick={() => setMenuOpen(false)}>
                로그인
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;