import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../api.js';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
        
        
        // 홈페이지로 리다이렉트
        window.location.href = '/';

      }

    } catch (err) {
      // api.js의 인터셉터에서 처리된 에러 메시지 사용
      setError(err);
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
            <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
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
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </div>
        
        <div className="social-login">
          <p>또는 소셜 계정으로 로그인</p>
          <div className="social-buttons">
            <button className="social-button google">
              Google로 로그인
            </button>
            <button className="social-button kakao">
              Kakao로 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;