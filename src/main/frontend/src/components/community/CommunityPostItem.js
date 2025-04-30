import './css/CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";

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
  
  return createdDate.toISOString().slice(0, 10);
}

function CommunityPostItem({ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount, profile_Image, imageUrl  }) {
  const relativeTime = getRelativeTime(createdAt);
  
  return (
    <div className="post-card">
      <Link
        to={`/community/${id}`}
        state={{ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount }}
        className="post-link-horizontal"
      >
        <div className="post-left">
          <div className="post-header">
            <img
              src={profile_Image || '/default-profile.png'}
              alt="프로필"
              className="profile-image"
            />
            <span className="author-name">{nickname}</span>
          </div>
          <strong className="post-title">{title}</strong>
          <p className="post-content">{content}</p>
          <div className="post-footer">
            <span className="post-meta">{relativeTime}</span>
            <div className="post-stats">
              <span><AiOutlineLike /> {likeCount}</span>
              <span><LuEye /> {viewCount}</span>
              <span><FaRegComment /> {commentCount}</span>
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="post-thumbnail">
            <img
              src={imageUrl}
              alt="썸네일"
              className="thumbnail-image"
            />
          </div>
        )}
      </Link>
    </div>

  );
}

export default CommunityPostItem;