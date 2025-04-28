import CommunityPostItem from './CommunityPostItem';
import './CommunityPostList.css'; // 필요하면 추가

function CommunityPostList({ posts }) {
  return (
    <div className="post-list">
      {posts.map(post => (
        <CommunityPostItem key={post.id} {...post} />
      ))}
    </div>
  );
}

export default CommunityPostList;
