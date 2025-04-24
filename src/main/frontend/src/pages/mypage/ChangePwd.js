import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './Mypage.css'; 

const ChangePwd = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 확인 검증
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 컨트롤러의 changePwd 엔드포인트로 요청
      // 현재 로그인한 사용자의 비밀번호를 변경하므로 이메일 필드는 제외
      await api.post('/changePwd', {
        password: currentPassword,
        newPassword: newPassword
      });
      
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      // 성공 후 3초 뒤에 마이페이지로 리다이렉트
      setTimeout(() => {
        navigate('/mypage');
      }, 3000);
    } catch (err) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className="my-page-container">
      <h1>비밀번호 변경</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="buttons">
          <button type="submit" className="submit-button">변경하기</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/mypage')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePwd;