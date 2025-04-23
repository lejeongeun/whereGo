// src/components/CommunityPostItem.js
import './CommunityPostItem.css';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";

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
            <span><AiOutlineLike />{likes}</span>
            <span><LuEye /> {views}</span>
            <span><FaRegComment /> {comments}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CommunityPostItem;
