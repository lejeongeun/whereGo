import { useState } from 'react';
import './css/CommunitySearch.css';

function CommunitySearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    if (onSearch) {
      onSearch(newKeyword); // 실시간 검색
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword); // 버튼 누를 때 검색
    }
  };

  return (
    <form className="community-search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="community-search-input"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={handleChange}
      />
      <button type="submit" className="community-search-button">검색</button>
    </form>
  );
}

export default CommunitySearch;
