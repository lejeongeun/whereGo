import { useState, useEffect } from 'react';
import CommunitySearch from '../../components/community/CommunitySearch';
import CommunitySortTabs from '../../components/community/CommunitySortTabs';
import CommunityPostList from '../../components/community/CommunityPostList';
import './css/CommunityPage.css';
import api from '../../api';
import { Link } from 'react-router-dom'; 

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('최신순');
  const [popularPosts, setPopularPosts] = useState([]);

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
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬
    } else if (criteria === '답변많은순') {
      sortedPosts.sort((a, b) => b.commentCount - a.commentCount); // 답변 많은 순 정렬
    } else if (criteria === '좋아요순') {
      sortedPosts.sort((a, b) => b.likeCount - a.likeCount); // 좋아요 많은 순 정렬
    } else if (criteria === '인기순') {
      sortedPosts.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount)); // 좋아요 많은 순 정렬
    }
    setFilteredPosts(sortedPosts); // 정렬된 게시물 상태로 업데이트
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setFilteredPosts(posts);
      return;
    }
    const result = posts.filter(p => 
      p.title.includes(keyword) || p.content.includes(keyword)
    );
    setFilteredPosts(result);
  };

  return (
    
    <div className="community-container">
      <h1 className="community-title">커뮤니티</h1>

      <div className="sort-tabs-wrapper">
        <CommunitySortTabs onSort={handleSort} />
      </div>

      <div className="post-list-wrapper">
        <div className="left-content">
          <CommunityPostList posts={filteredPosts} />
        </div>

        {/* <div className="right-sidebar">
          <h3>인기 게시물</h3>
          <div className="popular-posts">
            {popularPosts.map(post => (
              <div key={post.id} className="popular-post-item">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div> */}

      </div>

      <div className="search-write-bar">  
        <CommunitySearch onSearch={handleSearch} />
          <Link to="/community/write" className="write-button">✏️ 글쓰기</Link>
        </div>
      </div>
  );
}

export default CommunityPage;
