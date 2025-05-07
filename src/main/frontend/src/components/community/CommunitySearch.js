import { useState } from 'react';
import './css/CommunitySearch.css';

function CommunitySearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value);
  };

  return (
    <div className="community-search-form">
      <input
        type="text"
        className="community-search-input"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={handleChange}
      />
      <button type="submit" className="community-search-button">검색</button>
    </div>
  );
}

export default CommunitySearch;
