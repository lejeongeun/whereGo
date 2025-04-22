// CommunitySearch.js
import './CommunitySearch.css';
import { AiOutlineSearch } from 'react-icons/ai';

function CommunitySearch() {
  return (
    <div className="search-container">
      <div className="search-box">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="궁금한 질문을 검색해보세요!"
          className="search-input"
        />
      </div>
      <button className="search-button">검색</button>
    </div>
  );
}

export default CommunitySearch;
