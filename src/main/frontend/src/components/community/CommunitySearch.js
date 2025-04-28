import './CommunitySearch.css';
import { useState } from 'react';

function CommunitySearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    onSearch(newKeyword); // 글자 입력할 때마다 검색 실행
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword); // 버튼 눌러도 현재 키워드로 검색 실행
  };

  return (
    <form onSubmit={handleSubmit} className="community-search-form">
      <input 
        type="text" 
        placeholder="검색어를 입력하세요" 
        value={keyword} 
        onChange={handleChange} 
        className="community-search-input"
      />
      <button type="submit" className="community-search-button">검색</button>
    </form>
  );
}

export default CommunitySearch;
