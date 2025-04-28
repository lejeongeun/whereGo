import './CommunitySortTabs.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CommunitySortTabs() {
  const [activeTab, setActiveTab] = useState('최신순');

  const tabs = ['최신순', '정확도순', '답변많은순', '좋아요순'];

  return (
    <div className="sort-tabs-container">
      <div className="sort-tabs">
        {tabs.map((tab, index) => (
          <span
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
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
