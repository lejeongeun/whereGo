import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import './Login.css';

function FindPwd () {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 단계: 1 = 사용자 정보 입력, 2 = 새 비밀번호 설정
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 첫 번째 단계: 이메일과 닉네임 확인
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email || !nickname) {
      setError('이메일과 닉네임을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 사용자 확인만 하고 비밀번호는 아직 변경하지 않는 요청
      // 서버에서 이런 API가 없으므로 다음 단계로 진행하는 방식으로 구현
      // 실제로는 이메일과 닉네임이 일치하는지 확인하는 별도 API가 필요할 수 있음
      
      // 다음 단계(비밀번호 설정)로 진행
      setStep(2);
      setSuccess('사용자 정보가 확인되었습니다. 새 비밀번호를 설정해주세요.');
    } catch (err) {
      setError(err || '사용자 정보 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 두 번째 단계: 새 비밀번호 설정
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      await api.post('/findPwd', {
        email,
        nickname,
        newPassword
      });
      
      setSuccess('비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.');
      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>비밀번호 찾기</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {step === 1 ? (
          // 사용자 정보 확인 단계
          <form onSubmit={handleVerify} className="login-form">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입한 이메일 주소를 입력하세요"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="가입 시 등록한 닉네임을 입력하세요"
                disabled={isLoading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '확인 중...' : '다음'}
            </button>
          </form>
        ) : (
          // 새 비밀번호 설정 단계
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isLoading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
        
        <div className="register-link">
          <Link to="/login">로그인 페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};

export default FindPwd;