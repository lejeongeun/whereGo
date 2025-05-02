// CommunitySortTabs.js
import './css/CommunitySortTabs.css';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 

function CommunitySortTabs({ onSort }) {
  const [activeTab, setActiveTab] = useState('최신순');  // 현재 활성화된 탭 상태

  const tabs = ['최신순', '답변많은순', '좋아요순'];

  // 탭 클릭 시, 부모 컴포넌트로 정렬 기준을 전달하는 함수
  const handleTabClick = (tab) => {
    setActiveTab(tab);  // 클릭한 탭을 활성화
    onSort(tab);  // 부모 컴포넌트에 정렬 기준 전달
  };

  return (
    <div className="sort-tabs-container">
      <div className="sort-tabs">
        {tabs.map((tab, index) => (
          <span
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}  // 탭 클릭 시 정렬 기준 전달
          >
            {tab}
            {index < tabs.length - 1 && <span className="dot">·</span>}
          </span>
        ))}
      </div>
      <Link to="/community/write" className="write-button">✏️ 글쓰기</Link>
    </div>
  );
}

export default CommunitySortTabs;
