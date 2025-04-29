import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import api from '../../api';

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nickname: '', 
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validationRules = {
    nickname: {
      validate: value => !!value.trim(),
      errorMessage: '닉네임을 입력해주세요'
    },
    email: {
      validate: value => value && /\S+@\S+\.\S+/.test(value),
      errorMessage: value => !value ? '이메일을 입력해주세요' : '유효한 이메일 주소를 입력해주세요'
    },
    password: {
      validate: value => value && value.length >= 4,
      errorMessage: value => !value ? '비밀번호를 입력해주세요' : '비밀번호는 최소 4자 이상이어야 합니다'
    },
    confirmPassword: {
      validate: value => value && value === formData.password,
      errorMessage: value => !value ? '비밀번호 확인을 입력해주세요' : '비밀번호가 일치하지 않습니다'
    }
  };

  const validate = () => {
    const newErrors = {};
    
    Object.entries(validationRules).forEach(([field, { validate, errorMessage }]) => {
      const value = formData[field];
      if (!validate(value)) {
        newErrors[field] = typeof errorMessage === 'function' ? errorMessage(value) : errorMessage;
      }
    });
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { nickname, email, password } = formData;
      const response = await api.post('/signup', { nickname, email, password });
      
      if (response.data) {
        navigate('/login');
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (err) {
      setErrors({ 
        submit: err?.response?.data?.message || '이메일이 중복되어 회원가입에 실패했습니다. 다시 시도해주세요.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 입력 필드 컴포넌트 생성 함수
  const renderField = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={`${label}을(를) 입력하세요`}
        disabled={isLoading}
      />
      {errors[name] && <div className="input-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="SignUp-container">
      <div className="SignUp-card">
        <h2>회원가입</h2>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit} className="SignUp-form">
          {renderField('nickname', '닉네임')}
          {renderField('email', '이메일', 'email')}
          {renderField('password', '비밀번호', 'password')}
          {renderField('confirmPassword', '비밀번호 확인', 'password')}
          
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
      </div>
    </div>
  );
}

export default SignUp;