import './css/CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";
import { BsPersonCircle } from 'react-icons/bs';

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

function CommunityPostItem({
    id, title, content, nickname, createdAt,
    likeCount, viewCount, commentCount,
    profileImage, imageUrls
  }) {
  
    const relativeTime = getRelativeTime(createdAt);

    const thumbnail = Array.isArray(imageUrls) && imageUrls.length > 0 && imageUrls[0]?.url
    ? imageUrls[0].url
    : null;
  
  const maxLength = 100;
  const previewContent = content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;

    return (
      <div className="community-post-item"> 
      <div className="post-card">
        <Link
          to={`/community/${id}`}
          state={{
            id, title, content, nickname, createdAt,
            likeCount, viewCount, commentCount,
            imageUrls, profileImage
          }}
          className="post-link-horizontal"
        >
          <div className="post-left">
            <div className="post-header">

            {typeof profileImage === 'string' && profileImage.trim() !== '' ? (
                <img
                  src={profileImage.slice(profileImage.indexOf('/uploads/'))}
                  alt={`${nickname}님의 프로필`}
                  className="post-profile-image"
                />
              ) : (
                <BsPersonCircle className="post-profile-icon" size={32} color="#999" />
              )}

              <span className="author-name">{nickname}</span>
            </div>
            <strong className="post-title">{title}</strong>
            <p className="post-content">{previewContent}</p>
            <span className="post-meta">{relativeTime}</span>
          </div>
    
          <div className="post-right">
            <div className="thumbnail-wrapper">
              {thumbnail ? (
                <img
                  src={`http://localhost:8080${thumbnail}`}
                  alt="썸네일"
                  className="post-thumbnail"
                  onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                />
              ) : (
                <div className="thumbnail-placeholder" />
              )}
            </div>

            <div className="post-stats">
              <span><AiOutlineLike /> {likeCount}</span>
              <span><LuEye /> {viewCount}</span>
              <span><FaRegComment /> {commentCount}</span>
            </div>
          </div>
        </Link>
      </div>
      </div>
    );
  }
export default CommunityPostItem;