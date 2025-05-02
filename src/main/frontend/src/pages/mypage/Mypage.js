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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 페이징 처리 함수수
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const sortedCommunities = [...(userData.comunities || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPosts = userData.comunities.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedCommunities.slice(indexOfFirstPost, indexOfLastPost);

  // 로컬 스토리지 키 생성 헬퍼 함수
  const getProfileImageKey = (email) => `profileImage_${email}`;

  // 상태 리셋 헬퍼 함수
  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // 유저 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/mypage', {
          withCredentials: true
        });
        
        setUserData(response.data);
        
        // 사용자 이메일을 키로 사용하여 프로필 이미지 가져오기
        loadProfileImage(response.data.email);
        
        setIsLoading(false);
      } catch (err) {
        setError('사용자 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching user data:', err);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  // 이미지 로컬 스토리지 삭제 함수
  const removeImageFromLocalStorage = (email) => {
    if (email) {
      const userProfileImageKey = getProfileImageKey(email);
      localStorage.removeItem(userProfileImageKey);
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
      
      // 더 자세한 오류 정보 로깅
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
      {totalPosts > 0 ? (
        <>
          <div className="community-list">
            {currentPosts.map((post, index) => (
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
                {index < currentPosts.length - 1 && <div className="post-divider"></div>}
              </div>
            ))}
          </div>

          {/* 페이지 버튼 */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
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