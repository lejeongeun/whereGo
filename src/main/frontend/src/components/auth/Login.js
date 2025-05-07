import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import api from '../../api.js';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('전송할 데이터:', { email, password });
    // 입력값 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // 로그인 API 호출
      const response = await api.post('/login', { email, password });

      // 로그인 성공 처리
      if (response.data && response.data.email) {

        // 사용자 정보와 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', 'jwt-token-here'); // 백엔드에서 토큰을 제공한다면 response.data.token 사용
        localStorage.setItem('user', JSON.stringify({ 
          email: response.data.email 
        }));
        
        console.log('로그인 성공 - 저장된 데이터:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
        
        // onLoginSuccess prop이 있으면 호출
        if (typeof props?.onLoginSuccess === 'function') {
          props.onLoginSuccess();
        }
        // 현재 경로가 /schedule이면 새로고침, 아니면 메인화면으로 이동
        if (window.location.pathname === '/schedule') {
          window.location.reload();
        } else {
          window.location.href = '/';
        }
      }
  
    } catch (error) {
      console.error('로그인 오류:', error);
      
      // HTTP 상태 코드로 오류 구분
      if (error.response) {
        if (error.response.status === 401) {
          setError('이메일 또는 비밀번호가 잘못되었습니다.');
        } else {
          setError(error.response.data?.message || '로그인 중 오류가 발생했습니다.');
        }
      } else if (error.request) {
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setError('로그인 요청 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>로그인</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>
          
          <div className="forgot-password">
            <Link to="/findPwd">비밀번호를 잊으셨나요?</Link>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="register-link">
          계정이 없으신가요? <Link to="/signUp">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;