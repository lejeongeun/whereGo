import React from 'react';
import api from '../../api';

const ActionsSection = ({ userData, navigate, setError }) => {
  // 로컬 스토리지 키 생성 헬퍼 함수
  const getProfileImageKey = (email) => `profileImage_${email}`;

  // 이미지 로컬 스토리지 삭제 함수
  const removeImageFromLocalStorage = (email) => {
    if (email) {
      const userProfileImageKey = getProfileImageKey(email);
      localStorage.removeItem(userProfileImageKey);
    }
  };

  // 비밀번호 변경 페이지로 이동
  const navigateToChangePassword = () => {
    navigate('/changePwd');
  };

  // 계정 탈퇴 핸들러
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    
    if (confirmed) {
      try {
        // 올바른 API 엔드포인트로 수정
        await api.delete('/mypage/deletion', {
          withCredentials: true
        });
        
        // 계정 삭제 시 해당 사용자의 프로필 이미지 URL 제거
        removeImageFromLocalStorage(userData.email);
        
        navigate('/');
      } catch (err) {
        setError('계정 탈퇴에 실패했습니다.');
        console.error('Error deleting account:', err);
        
        // 더 자세한 오류 정보
        if (err.response) {
          console.error('Server response:', err.response.data);
          console.error('Status code:', err.response.status);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
      }
    }
  };

  return (
    <div className="actions-section">
      <button className="action-button" onClick={navigateToChangePassword}>
        비밀번호 변경
      </button>
      <button className="delete-account action-button" onClick={handleDeleteAccount}>
        계정 탈퇴
      </button>
    </div>
  );
};

export default ActionsSection;