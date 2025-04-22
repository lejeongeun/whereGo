// src/components/CommunityPostItem.js
import './CommunityPostItem.css';
import { Link } from 'react-router-dom';

function CommunityPostItem({ id, title, content, author, time, likes, views, comments }) {
  return (
    <div className="post-card">
      <Link to={`/community/${id}`} className="post-link">
        <div className="post-header">
          <span className="author-name">{author}</span>
          <strong className="post-title">{title}</strong>
        </div>
        <p className="post-content">{content}</p>
        <div className="post-footer">
          <span className="post-meta">{time}</span>
          <div className="post-stats">
            <span>👍 {likes}</span>
            <span>👁 {views}</span>
            <span>💬 {comments}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CommunityPostItem;
