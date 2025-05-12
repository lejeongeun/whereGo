import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BsPersonCircle } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";

const ProfileSection = ({ userData, setSuccess, setError, resetMessages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 로컬 스토리지 키 생성 헬퍼 함수
  const getProfileImageKey = (email) => `profileImage_${email}`;

  // 컴포넌트 마운트 시 이미지 로드
  useEffect(() => {
    if (userData.email) {
      loadProfileImage(userData.email);
    }
  }, [userData]);

  // 프로필 이미지 로드 함수
  const loadProfileImage = (email) => {
    if (email) {
      const userProfileImageKey = getProfileImageKey(email);
      const savedImage = localStorage.getItem(userProfileImageKey);
      if (savedImage) {
        setSelectedImage(savedImage);
      }
    }
  };

  // 이미지 로컬 스토리지 저장 함수
  const saveImageToLocalStorage = (email, imageData) => {
    if (email) {
      const userProfileImageKey = getProfileImageKey(email);
      localStorage.setItem(userProfileImageKey, imageData);
    }
  };

  // 파일 유효성 검사 함수
  const validateImageFile = (file) => {
    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return false;
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB 이하여야 합니다.');
      return false;
    }

    return true;
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    resetMessages();

    if (!validateImageFile(file)) {
      return;
    }

    // 로컬에서 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setSelectedImage(imageDataUrl);
      
      // 로컬 스토리지에 이미지 저장
      saveImageToLocalStorage(userData.email, imageDataUrl);
      
      setSelectedFile(file); // 파일 객체 저장
      
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
    resetMessages();

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

  // 게시글 수
  const postCount = userData.comunities ? userData.comunities.length : 0;

  return (
    <div className="profile-section">
      <div className="profile-image-container">
        {selectedImage ? (
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
          <span className="label">이메일</span>
          <span className="value">{userData.email}</span>
        </div>
        
        <div className="info-item">
          <span className="label">닉네임</span>
          <span className="value">{userData.nickname}</span>
        </div>
        
        {/* 포스팅 수만 표시 */}
        <div className="user-stats-single">
          <div className="stat-item-single">
            <span className="stat-label">포스팅</span>
            <span className="stat-value">{postCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;