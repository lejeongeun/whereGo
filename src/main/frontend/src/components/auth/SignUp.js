import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // 이름 검증
    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    // 이메일 검증
    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }
    
    // 비밀번호 확인 검증
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // 실제 구현에서는 여기서 API 호출
      // 예시: const response = await SignUpUser(formData);
      
      // 회원가입 성공 처리 (임시 구현)
      setTimeout(() => {
        // 성공적으로 가입 후 자동 로그인을 위한 토큰 저장 (실제 API 응답에서 받을 것)
        localStorage.setItem('token', 'dummy-SignUp-token');
        localStorage.setItem('user', JSON.stringify({ 
          name: formData.name,
          email: formData.email
        }));
        
        // 홈페이지로 리다이렉트 또는 로그인 페이지로 이동
        navigate('/');
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      // 에러 처리
      setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="SignUp-container">
      <div className="SignUp-card">
        <h2>회원가입</h2>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit} className="SignUp-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              disabled={isLoading}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="이메일 주소를 입력하세요"
              disabled={isLoading}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
            {errors.password && <div className="input-error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
          </div>
          
          <div className="terms-agreement">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="SignUp-button"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        
        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
        
        <div className="social-SignUp">
          <p>또는 소셜 계정으로 가입</p>
          <div className="social-buttons">
            <button className="social-button google">
              Google로 가입
            </button>
            <button className="social-button kakao">
              Kakao로 가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;