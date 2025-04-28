import { useState, useEffect } from 'react';
import CommunitySearch from './CommunitySearch';
import CommunityPostItem from './CommunityPostItem';
import api from '../../api';

function CommunityPostList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    api.get('/community/list')
      .then(res => {
        console.log('서버 응답:', res.data);
        setPosts(res.data);
        setFilteredPosts(res.data); // 처음엔 전체 게시글
      })
      .catch(err => console.error('서버 요청 실패: ', err));
  }, []);

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredPosts(posts); // 검색어 없으면 전체
    } else {
      const filtered = posts.filter(post => 
        post.title.includes(searchKeyword) || post.content.includes(searchKeyword)
      );
      setFilteredPosts(filtered);
    }
  }, [searchKeyword, posts]);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <div>
      <CommunitySearch onSearch={handleSearch} />
      {filteredPosts.map(post => (
        <CommunityPostItem key={post.id} {...post} />
      ))}
    </div>
  );
}

export default CommunityPostList;
