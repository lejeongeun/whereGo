import { useState, useEffect } from 'react';
import CommunitySearch from '../../components/community/CommunitySearch';
import CommunitySortTabs from '../../components/community/CommunitySortTabs';
import CommunityPostList from '../../components/community/CommunityPostList';
import './css/CommunityPage.css';
import api from '../../api';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('최신순');
  const [popularPosts, setPopularPosts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // ✅ 로그인 여부 확인

  useEffect(() => {
    api.get('/community/list')
      .then(res => {
        setPosts(res.data);
        setFilteredPosts(res.data);
  
        const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredPosts(sorted);
  
        const sortedPopularPosts = [...res.data].sort((a, b) => b.likeCount - a.likeCount);
        setPopularPosts(sortedPopularPosts.slice(0, 3));
      })
      .catch(err => console.error('게시글 불러오기 실패:', err));
  }, []);

  // 정렬 기준에 따라 필터링
  const handleSort = (criteria) => {
    setSortOrder(criteria);
    let sortedPosts = [...posts];
    if (criteria === '최신순') {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (criteria === '답변많은순') {
      sortedPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else if (criteria === '좋아요순') {
      sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else if (criteria === '인기순') {
      sortedPosts.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount));
    }
    setFilteredPosts(sortedPosts);
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setFilteredPosts(posts);
      setIsSearching(false);
      return;
    }

    const result = posts.filter(p =>
      p.title.includes(keyword) || p.content.includes(keyword)
    );

    setFilteredPosts(result);
    setIsSearching(true);
  };

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      alert('글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    navigate('/community/write');
  };

  return (
    <div className="community-container">
      <div className="sort-tabs-wrapper">
        <CommunitySortTabs onSort={handleSort} />
      </div>

      <div className="post-list-wrapper">
        <div className="left-content">
          <CommunityPostList posts={filteredPosts} isSearching={isSearching}/>
        </div>
      </div>

      <div className="search-write-bar">  
        <CommunitySearch onSearch={handleSearch} />
        <button className="write-button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default CommunityPage;
