import './css/CommunitySortTabs.css';
import { useState } from 'react';

function CommunitySortTabs({ onSort }) {
  const [activeTab, setActiveTab] = useState('최신순'); 
  const tabs = ['최신순', '답변많은순', '좋아요순', '인기순'];

  const handleTabClick = (tab) => {
    setActiveTab(tab);  
    onSort(tab);  
  };

  return (
    <div className="sort-tabs-container">
      <div className="sort-tabs">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)} 
          >
            {tab}
            {i < tabs.length - 1 && <span className="dot">·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CommunitySortTabs;
