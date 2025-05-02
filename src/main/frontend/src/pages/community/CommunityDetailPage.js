import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  const location = useLocation();
  const [post, setPost] = useState(location.state || null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
    } else {
      console.warn("비로그인 상태, 조회수 증가 요청 안 보냄");
    }
  
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

  const { title, content, nickname, createdAt, likeCount, viewCount, commentCount, imageUrls, profileImage } = post;


  console.log("📷 첨부 이미지 리스트:", imageUrls);

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
      .then(() => api.get(`/community/${id}/like/count`))
      .then((res) => {
        setPost(prev => ({...prev, likeCount: res.data }));
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

      <div className="detail-author">
        <img 
          src={profileImage || '/default-profile.png'} 
          alt="프로필 이미지" 
          className="detail-profile-image"
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
        <div className="detail-content">
          <p>{content}</p>
        </div>
      </div>

      {imageUrls && imageUrls.length > 0 && (
        <div className="detail-images">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={`http://localhost:8080${url}`}
              alt={`첨부 이미지 ${i + 1}`}
              className="detail-image"
            />
          ))}
        </div>
      )}

      <div className="button-group">
        <button className="edit-button" onClick={handleEdit}>수정</button>
        <button className="delete-button" onClick={handleDelete}>삭제</button>
      </div>

      <CommentSection postId={id} />
    </div>
  );
}

export default CommunityDetailPage;
