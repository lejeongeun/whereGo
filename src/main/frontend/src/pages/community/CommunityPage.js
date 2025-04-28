import { useState, useEffect } from 'react';
import CommunitySearch from '../../components/community/CommunitySearch';
import CommunitySortTabs from '../../components/community/CommunitySortTabs';
import CommunityPostList from '../../components/community/CommunityPostList';
import './CommunityPage.css';
import api from '../../api';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    api.get('/community/list')
      .then(res => {
        setPosts(res.data);
        setFilteredPosts(res.data);
      })
      .catch(err => console.error('게시글 불러오기 실패:', err));
  }, []);

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
        <CommunitySortTabs />
      </div>
      <CommunityPostList posts={filteredPosts} />
    </div>
  );
}

export default CommunityPage;
