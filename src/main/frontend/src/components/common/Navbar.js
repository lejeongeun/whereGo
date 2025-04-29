import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태를 확인하는 함수
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        console.log("로그인 상태: 로그인됨", parsedUser);
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      console.log("로그인 상태: 로그아웃됨");
    }
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
    
    // localStorage 변경 이벤트를 감지하는 리스너 추가
    window.addEventListener('storage', checkLoginStatus);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // 사용자 정의 이벤트를 통해 로그인 상태 변경 감지
  useEffect(() => {
    // 로그인 상태 변경 이벤트 리스너 등록
    const handleLoginChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('loginStateChanged', handleLoginChange);
    
    return () => {
      window.removeEventListener('loginStateChanged', handleLoginChange);
    };
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('loginStateChanged'));
    
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  console.log("렌더링 시 로그인 상태:", isLoggedIn);

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