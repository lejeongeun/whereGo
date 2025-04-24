import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js';
import './Mypage.css';

const MyPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    createdAt: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 유저 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/mypage');
        
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        // 에러 처리는 인터셉터에서 처리되므로 여기서는 간단히 처리
        setError('사용자 정보를 불러오는데 실패했습니다.');
        setIsLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  // 비밀번호 변경 페이지로 이동
  const navigateToChangePassword = () => {
    navigate('/changePwd');
  };

  // 계정 탈퇴 핸들러
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    
    if (confirmed) {
      try {
        await api.delete('/members');
        navigate('/');
      } catch (err) {
        setError('계정 삭제에 실패했습니다.');
        console.error('Error deleting account:', err);
      }
    }
  };

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return <div className="my-page-container">로딩 중...</div>;
  }

  return (
    <div className="my-page-container">
      <h1>마이페이지</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="user-info-section">
        <div className="info-item">
          <span className="label">닉네임:</span>
          <span className="value">{userData.nickname}</span>
        </div>

        <div className="info-item">
          <span className="label">이메일:</span>
          <span className="value">{userData.email}</span>
        </div>
      </div>
      
      <div className="actions-section">
        <button className="action-button" onClick={navigateToChangePassword}>
          비밀번호 변경
        </button>
        <button className="delete-account action-button" onClick={handleDeleteAccount}>
          계정 탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyPage;