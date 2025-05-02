import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import axios from 'axios';
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
  const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 객체 저장
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
        
        // 사용자 이메일을 키로 사용하여 프로필 이미지 가져오기
        if (response.data.email) {
          const userProfileImageKey = `profileImage_${response.data.email}`;
          const savedImage = localStorage.getItem(userProfileImageKey);
          if (savedImage) {
            setSelectedImage(savedImage);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        // 더미 데이터
        const dummyEmail = 'test@example.com';
        setUserData({
          email: dummyEmail,
          nickname: '테스트사용자',
          createdAt: '2023-04-24T10:00:00',
          comunities: [
            { id: 1, title: '여행 계획 공유합니다', content: '제주도 3박 4일 여행 계획이에요...', createdAt: '2023-04-20T15:30:00' },
            { id: 2, title: '서울 맛집 추천', content: '강남역 근처 맛집 리스트입니다...', createdAt: '2023-04-15T09:45:00' }
          ]
        });
        
        // 더미 이메일을 키로 사용하여 프로필 이미지 가져오기
        const userProfileImageKey = `profileImage_${dummyEmail}`;
        const savedImage = localStorage.getItem(userProfileImageKey);
        if (savedImage) {
          setSelectedImage(savedImage);
        }
        
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

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 로컬에서 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setSelectedImage(imageDataUrl);
      
      // 사용자 이메일을 키로 사용하여 localStorage에 이미지 저장
      if (userData.email) {
        const userProfileImageKey = `profileImage_${userData.email}`;
        localStorage.setItem(userProfileImageKey, imageDataUrl);
      }
      
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
      // 업로드 실패 시에도 로컬에 저장된 이미지는 유지됨
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
        
        // 계정 삭제 시 해당 사용자의 프로필 이미지 제거
        if (userData.email) {
          const userProfileImageKey = `profileImage_${userData.email}`;
          localStorage.removeItem(userProfileImageKey);
        }
        
        navigate('/');
      } catch (err) {
        setError('계정 삭제에 실패했습니다.');
        console.error('Error deleting account:', err);
      }
    }
  };

  // 게시글 상세 페이지로 이동
  const navigateToCommunityDetail = (postId) => {
    navigate(`/community/${postId}`);
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
            {userData.comunities.map((post, index) => (
              <div key={post.id} className="community-item">
                <h3 
                  className="post-title clickable" 
                  onClick={() => navigateToCommunityDetail(post.id)}
                >
                  {post.title}
                </h3>
                <p className="post-content">{post.content}</p>
                <div className="post-info">
                  <span className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {index < userData.comunities.length - 1 && <div className="post-divider"></div>}
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