import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import './CommunityEditPage.css';

function CommunityEditPage() {
  const { id } = useParams();               // URL에서 글 ID 가져옴
  const navigate = useNavigate();
  const location = useLocation();            // 수정할 데이터 받을 수도 있음
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // 상세페이지에서 수정페이지로 넘어올 때 state로 넘긴 경우
    if (location.state) {
      setTitle(location.state.title);
      setContent(location.state.content);
    } else {
      // 새로고침하거나 직접 접근했을 경우 서버에서 다시 불러오기
      api.get(`/community/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(err => {
          console.error('게시글 불러오기 실패:', err);
          alert('게시글을 불러오지 못했습니다.');
          navigate('/community');
        });
    }
  }, [id, location.state, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/community/${id}/edit`, { title, content })
      .then(() => {
        alert('게시글이 수정되었습니다.');
        navigate(`/community/${id}`);
      })
      .catch(err => {
        console.error('게시글 수정 실패:', err);
        alert('수정 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="edit-container">
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="edit-title"
        />
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="edit-content"
        />
        <button type="submit" className="save-button">저장</button>
      </form>
    </div>
  );
}

export default CommunityEditPage;
