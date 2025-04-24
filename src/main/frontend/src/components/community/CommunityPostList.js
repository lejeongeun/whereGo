import { useEffect, useState } from 'react';
import CommunityPostItem from './CommunityPostItem';
import { getPosts } from '../../api/communityApi';

function CommunityPostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then((res) => {
        console.log("📦 받아온 데이터:", res.data);
        setPosts(res.data); // ✅ axios는 응답을 res.data에 담아줘!
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
      });
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <CommunityPostItem key={index} {...post} />
      ))}
    </div>
  );
}

export default CommunityPostList;
