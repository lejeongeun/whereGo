import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import axios from 'axios'; // 직접 axios 추가
import './Mypage.css';
import { AiFillSetting } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";

const MyPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    createdAt: '',
    comunities: []
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [response, setSelectedFile] = useState(null); // 실제 파일 객체 저장
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // 성공 메시지 상태 추가
  const [isUploading, setIsUploading] = useState(false); // 업로드 진행 상태
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 유저 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/mypage', {
          withCredentials: true
        });
        
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        // 더미 데이터
        setUserData({
          email: 'test@example.com',
          nickname: '테스트사용자',
          createdAt: '2023-04-24T10:00:00',
          comunities: [
            { id: 1, title: '여행 계획 공유합니다', content: '제주도 3박 4일 여행 계획이에요...', createdAt: '2023-04-20T15:30:00' },
            { id: 2, title: '서울 맛집 추천', content: '강남역 근처 맛집 리스트입니다...', createdAt: '2023-04-15T09:45:00' }
          ]
        });
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (예: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 로컬에서 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setSelectedFile(file); // 파일 객체 저장
      setError(null);
      
      // 이미지 선택 후 자동 업로드
      handleSaveProfileImage(file);
    };
    reader.readAsDataURL(file);
  };

  // 프로필 이미지 서버에 저장
  const handleSaveProfileImage = async (file) => {
    if (!file) {
      setError('업로드할 이미지를 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    // FormData 객체 생성 및 파일 추가
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 서버에 이미지 업로드 요청
      const response = await axios.post('http://localhost:8080/api/mypage/upload', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      setSuccess('프로필 이미지가 성공적으로 업로드되었습니다.');
      console.log('이미지 업로드 성공:', response.data);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 업로드 버튼 클릭 핸들러
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
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
        await api.delete('/members', {
          withCredentials: true
        });
        
        navigate('/');
      } catch (err) {
        setError('계정 삭제에 실패했습니다.');
        console.error('Error deleting account:', err);
      }
    }
  };

  // 로딩 중
  if (isLoading) {
    return <div className="my-page-container">loading...</div>;
  }

  return (
    <div className="my-page-container">
      <h1>마이페이지</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-section">
        <div className="profile-image-container">
          {isUploading ? (
            <div className="loading-spinner">업로드 중...</div>
          ) : selectedImage ? (
            <img 
              src={selectedImage} 
              alt="프로필 이미지" 
              className="profile-image" 
              onError={() => {
                alert('이미지 로드 실패');
              }}
            />
          ) : (
            <BsPersonCircle className="profile-icon" size={100} color="#6c757d" />
          )}
          
          <button 
            className="change-image-button" 
            onClick={handleUploadButtonClick}
            disabled={isUploading}
          >
           <AiFillSetting size={24} />
          </button>
                
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="user-info-section">
          <div className="info-item">
            <span className="label">이메일:</span>
            <span className="value">{userData.email}</span>
          </div>
          
          <div className="info-item">
            <span className="label">닉네임:</span>
            <span className="value">{userData.nickname}</span>
          </div>
        </div>
      </div>
      
      {/* 커뮤니티 섹션 */}
      <div className="community-section">
        <h2>내가 작성한 글</h2>
        {userData.comunities && userData.comunities.length > 0 ? (
          <div className="community-list">
            {userData.comunities.map((post) => (
              <div key={post.id} className="community-item">
                <h3>{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <div className="post-info">
                  <span className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-posts">작성한 글이 없습니다.</p>
        )}
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