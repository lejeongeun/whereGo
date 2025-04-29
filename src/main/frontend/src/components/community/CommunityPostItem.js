import './CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns'; // date-fns import
import { ko } from 'date-fns/locale';  // 한국어 로케일 import

function CommunityPostItem({ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount }) {
  // createdAt을 상대적인 시간으로 변환 (한국어로 표시)
  const relativeTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ko });

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
          <span className="post-meta">{relativeTime}</span>  {/* 상대적인 시간 표시 */}
          <div className="post-stats">
            <span><AiOutlineLike />{likeCount}</span>
            <span><LuEye /> {viewCount}</span>
            <span><FaRegComment /> {commentCount}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CommunityPostItem;
