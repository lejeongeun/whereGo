import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './Mypage.css';
import ProfileSection from './ProfileSection';
import PostsTab from './PostsTab';
import ChecklistTab from './ChecklistTab';
import ScheduleTab from './ScheduleTab';
import ActionsSection from './ActionsSection';
import { FaList, FaCalendarAlt, FaCheckSquare } from "react-icons/fa";

const MyPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    createdAt: '',
    comunities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();
  
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
        setIsLoading(false);
      } catch (err) {
        setError('사용자 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching user data:', err);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  return (
    <div className="my-page-container">
      <h1>마이페이지</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {/* 프로필 섹션 컴포넌트 */}
      <ProfileSection 
        userData={userData}
        setSuccess={setSuccess}
        setError={setError}
        resetMessages={resetMessages}
      />

      {/* 탭 메뉴 */}
      <div className="tabs-menu">
        <button 
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <FaList className="tab-icon" /> 내가 작성한 글
        </button>
        <button 
          className={`tab-button ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          <FaCheckSquare className="tab-icon" /> 체크리스트
        </button>
        <button 
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <FaCalendarAlt className="tab-icon" /> 일정 리스트
        </button>
      </div>
      
      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {/* 내가 작성한 글 탭 */}
        {activeTab === 'posts' && <PostsTab posts={userData.comunities} navigate={navigate} />}
        
        {/* 체크리스트 탭 */}
        {activeTab === 'checklist' && <ChecklistTab userEmail={userData.email} viewOnly={true} />}
        
        {/* 일정 리스트 탭 */}
        {activeTab === 'schedule' && <ScheduleTab userEmail={userData.email} />}
      </div>
      
      {/* 액션 버튼 섹션 */}
      <ActionsSection userData={userData} navigate={navigate} setError={setError} />
    </div>
  );
};

export default MyPage;