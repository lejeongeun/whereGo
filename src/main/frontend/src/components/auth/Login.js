import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // 실제 구현에서는 여기서 API 호출
      // 예시: const response = await loginUser(email, password);
      
      // 로그인 성공 처리 (임시 구현)
      setTimeout(() => {
        // 로컬 스토리지에 토큰 저장 (실제 구현에서는 API 응답에서 받은 토큰 사용)
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('user', JSON.stringify({ email, name: '사용자' }));
        
        // 홈페이지로 리다이렉트
        navigate('/');
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
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