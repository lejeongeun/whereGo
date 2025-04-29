import './CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";

//date-fns 삭제
function getRelativeTime(createdAt) {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffMs = now - createdDate;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return `${diffSeconds}초 전`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  
  // 일주일 이상이면 날짜만 출력 (yyyy-mm-dd)
  return createdDate.toISOString().slice(0, 10);
}

function CommunityPostItem({ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount }) {
  const relativeTime = getRelativeTime(createdAt);

  return (
    <div className="post-card">
      <Link 
        to={`/community/${id}`} 
        state={{ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount }}
        className="post-link"
      >
        <div className="post-header">
          <span className="author-name">{nickname}</span>
          <strong className="post-title">{title}</strong>
        </div>
        <p className="post-content">{content}</p>
        <div className="post-footer">
          <span className="post-meta">{relativeTime}</span> {/* 상대적인 시간 표시 */}
          <div className="post-stats">
            <span><AiOutlineLike /> {likeCount}</span>
            <span><LuEye /> {viewCount}</span>
            <span><FaRegComment /> {commentCount}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CommunityPostItem;