import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './CommunityDetailPage.css';
import { deletePost } from '../../api/communityApi';
import api from '../../api';

import { AiOutlineLike } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";


function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(location.state || null);

  useEffect(() => {
    if (!post) {
      api.get(`/community/${id}`)
        .then(res => {
          setPost(res.data);
        })
        .catch(err => {
          console.error('게시글 불러오기 실패:', err);
          alert('게시글을 불러올 수 없습니다.');
          navigate('/community');
        });
    }
  }, [id, post, navigate]);

  if (!post) return <div>로딩중...</div>

  const { title, content, nickname, createdAt, likeCount, viewCount, commentCount } = post;

  const handleEdit = () => {
    navigate(`/community/${id}/edit`, { state: { title, content } });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    deletePost(id)
      .then(() => {
        alert('삭제되었습니다.');
        navigate('/community');
      })
      .catch((err) => {
        console.error('삭제 실패! : ', err);
        alert('삭제 중 오류 발생!!');
      });
  };

  const handleLike = () => {
    api.post(`/community/${id}/like`)
      .then(() => {
        return api.get(`/community/${id}/like/count`);
      })
      .then((res) => {
        setPost(prev => ({
          ...prev,
          likeCount: res.data,
        }));
      })
      .catch(err => {
        console.error('좋아요 실패: ', err);
        alert('좋아요 처리 중 오류 발생!');
      });
  };

  return (
    <div className="detail-container">
      <h2 className="detail-title">{title}</h2>
      <div className="detail-meta">
        <span className="author">{nickname}</span>
        <span className="time">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="detail-content">
        <p>{content}</p>
      </div>
      <div className="detail-stats">
        <button onClick={handleLike} className="like-button">
          <AiOutlineLike />{likeCount}
        </button>
        <span><LuEye /> {viewCount}</span>
        <span><FaRegComment /> {commentCount}</span>
      </div>
      <button className="delete-button" onClick={handleDelete}>삭제</button>
      <button className="edit-button" onClick={handleEdit}>수정</button>
    </div>
  );
}

export default CommunityDetailPage;
