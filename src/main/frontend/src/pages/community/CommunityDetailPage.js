import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/CommunityDetailPage.css';
import { deletePost } from '../../api/communityApi';
import api from '../../api';
import CommentSection from '../../components/community/CommentSection';

import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";

function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const loggedInNickname = localStorage.getItem('nickname');
  console.log("🔥 로그인 닉네임:", localStorage.getItem('nickname'));
  console.log("🔥 게시글 작성자 닉네임:", post?.nickname);
  
  useEffect(() => {
    api.get(`/community/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        alert('게시글 불러오기 실패');
        navigate('/community');
      });
  }, [id, navigate]);

  if (!post) return <div>로딩중...</div>;

  const {
    title, content, nickname, createdAt,
    likeCount, viewCount, commentCount,
    imageUrls, profileImage
  } = post;

  const handleEdit = () => {
    navigate(`/community/${id}/edit`, { state: { title, content, imageUrls } });
  };

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    deletePost(id)
      .then(() => navigate('/community'))
      .catch(() => alert('삭제 실패'));
  };

  const handleLike = () => {
    api.post(`/community/${id}/like`)
      .then(() => api.get(`/community/${id}/like/count`))
      .then((res) => setPost(prev => ({ ...prev, likeCount: res.data })))
      .catch(() => alert('좋아요 실패'));
  };

  return (
    <div className="detail-container">
      <h2 className="detail-title">{title}</h2>
      <div className="detail-meta">
        <div className="detail-author">
          <img
            src={
              typeof profileImage === 'string' && profileImage.trim() !== ''
                ? `http://localhost:8080${profileImage.slice(profileImage.indexOf('/uploads/'))}`
                : '/default-profile.png'
            }
            alt={`${nickname}님의 프로필`}
            className="post-profile-image"
          />
          <span className="author">{nickname}</span>
        </div>
        <div className="time-and-views">
          <span className="time">{new Date(createdAt).toLocaleString()}</span>
          <span className="views"><LuEye /> {viewCount}</span>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-like">
          <button onClick={handleLike} className="like-icon-button">
            <AiOutlineLike /> {likeCount}
          </button>
          <span><FaRegComment /> {commentCount}</span>
        </div>

        {Array.isArray(imageUrls) && imageUrls.length > 0 && (
          <div className="detail-images">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:8080${url}`}
                alt={`이미지-${index}`}
                className="detail-image"
              />
            ))}
          </div>
        )}

        <div className="detail-content">
          <p>{content}</p>
        </div>
      </div>

      <div className="button-group">
        {post?.nickname === loggedInNickname && (
          <>
            <button onClick={handleEdit} className="edit-button">수정</button>
            <button onClick={handleDelete} className="delete-button">삭제</button>
          </>
        )}
      </div>

      <CommentSection postId={id} />
    </div>
  );
}

export default CommunityDetailPage;