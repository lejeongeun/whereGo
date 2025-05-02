// CommunityPage.js
import { useState, useEffect } from 'react';
import CommunitySearch from '../../components/community/CommunitySearch';
import CommunitySortTabs from '../../components/community/CommunitySortTabs';
import CommunityPostList from '../../components/community/CommunityPostList';
import './css/CommunityPage.css';
import api from '../../api';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('최신순');  // 기본적으로 최신순
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    api.get('/community/list')
      .then(res => {
        console.log("📸 게시글 목록 데이터:", res.data);
        console.log("🧪 첫 번째 게시글:", res.data[0].profileImage);
        setPosts(res.data);
        setFilteredPosts(res.data);

        // 인기 게시물 3개 추출 (기준: 좋아요순 또는 댓글 많은 순)
        let sortedPopularPosts = [...res.data];

        // 예시: 좋아요순으로 정렬
        sortedPopularPosts.sort((a, b) => b.likeCount - a.likeCount);

        // 상위 3개 게시물만 가져오기
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
      <CommunitySearch onSearch={handleSearch} />
      <div className="top-bar">
        <CommunitySortTabs onSort={handleSort} />
      </div>
      <div className="content-wrapper">
        <div className="left-content">
          <CommunityPostList posts={filteredPosts} />
        </div>
        <div className="right-sidebar">
          <h3>인기 게시물</h3>
          <div className="popular-posts">
            {popularPosts.map(post => (
              <div key={post.id} className="popular-post-item">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                {/* 필요한 추가 정보(작성자, 날짜 등)도 추가할 수 있습니다. */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
