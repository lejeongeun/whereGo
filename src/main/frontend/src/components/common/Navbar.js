import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import NotificationPage from '../../notification/NotificationPage';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setMember] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setMember(parsedUser);
      } catch (error) {
        setIsLoggedIn(false);
        setMember(null);
      }
    } else {
      setIsLoggedIn(false);
      setMember(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const handleLoginChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('loginStateChanged', handleLoginChange);
    return () => {
      window.removeEventListener('loginStateChanged', handleLoginChange);
    };
  }, []);

  const handleLogout = () => {
    // 모든 사용자 관련 데이터 제거
    const keysToRemove = ['token', 'user', 'email', 'nickname'];
    
    // localStorage에서 사용자 관련 데이터 제거
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // 추가적으로 저장된 사용자 관련 데이터가 있을 경우를 대비해
    // localStorage를 검사하여 사용자 관련 데이터 제거
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // 사용자 관련 데이터로 판단되는 키 제거
      if (key && (
        key.includes('user') || 
        key.includes('member') || 
        key.includes('auth') || 
        key.includes('login')
      )) {
        localStorage.removeItem(key);
      }
    }
    
    // 상태 초기화
    setIsLoggedIn(false);
    setMember(null);
    setMessages([]);
    setHasNewNotification(false);
    
    // 로그인 상태 변경 이벤트 발생시키기
    window.dispatchEvent(new Event('loginStateChanged'));
    
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleNotificationModal = () => {
    setShowNotificationModal(!showNotificationModal);
    setHasNewNotification(false); // 모달 열면 새 알림 표시 없앰
  };

  // WebSocket 연결: 알림 수신 및 저장
  useEffect(() => {
    // 로그인된 경우에만 웹소켓 연결
    if (!isLoggedIn || !member || !member.email) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('웹소켓 연결 완료');
        // 사용자 개인 구독 채널
        client.subscribe(`/topic/notifications/${member.email}`, (message) => {
          console.log('📩 알림 도착:', message.body);
          setMessages(prev => [...prev, message.body]);
          setHasNewNotification(true); // 새 알림 표시
        });
      },
      debug: (str) => console.log('[WebSocket Debug]', str),
    });

    client.activate();
    return () => client.deactivate();
  }, [isLoggedIn, member]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo-link">
            <div className="logo">어디GO</div>
          </Link>

          <div className="menu-icon" onClick={toggleMenu}>
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>

          <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item"><Link to="/schedule" className="nav-link" onClick={() => setMenuOpen(false)}>일정리스트</Link></li>
            <li className="nav-item"><Link to="/weather" className="nav-link" onClick={() => setMenuOpen(false)}>나라별 날씨</Link></li>
            <li className="nav-item"><Link to="/exchange" className="nav-link" onClick={() => setMenuOpen(false)}>나라별 환율</Link></li>
            <li className="nav-item"><Link to="/checklist" className="nav-link" onClick={() => setMenuOpen(false)}>체크리스트</Link></li>
            <li className="nav-item"><Link to="/community" className="nav-link" onClick={() => setMenuOpen(false)}>커뮤니티</Link></li>

            {isLoggedIn && (
              <li className="nav-item notification-icon" onClick={toggleNotificationModal}>
                <FaBell size={22} color={hasNewNotification ? '#007bff' : 'black'} />
                {hasNewNotification && <span className="notification-dot" />}
              </li>
            )}

            <li className="nav-item member-section">
              <div className="auth-links">
                {isLoggedIn ? (
                  <>
                    <Link to="/mypage" className="auth-link" onClick={() => setMenuOpen(false)}>mypage</Link>
                    <span className="auth-link" onClick={handleLogout}>logout</span>
                  </>
                ) : (
                  <>
                    <span className="auth-link" onClick={() => { navigate('/login'); setMenuOpen(false); }}>login</span>
                    <span className="auth-link" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>join</span>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* 알림 모달: Navbar에서 messages를 넘겨줌 */}
      {showNotificationModal && (
        <div className="notification-modal">
          <div className="notification-modal-content">
            <button className="close-button" onClick={toggleNotificationModal}>닫기</button>
            <NotificationPage messages={messages} />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;