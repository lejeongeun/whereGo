// src/components/CommunityPostItem.js
import './CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";

function CommunityPostItem({ id, title, content, nickname, createdAt, likeCount, viewCount, commentCount }) {
  return (
    <div className="post-card">
      <Link to={`/community/${id}`} className="post-link">
        <div className="post-header">
          <span className="author-name">{nickname}</span>
          <strong className="post-title">{title}</strong>
        </div>
        <p className="post-content">{content}</p>
        <div className="post-footer">
          <span className="post-meta">{new Date(createdAt).toLocaleString()}</span>
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
