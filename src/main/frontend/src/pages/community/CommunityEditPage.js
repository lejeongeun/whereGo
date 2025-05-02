import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import './css/CommunityEditPage.css';

function CommunityEditPage() {
  const { id } = useParams();               
  const navigate = useNavigate();
  const location = useLocation();           
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title);
      setContent(location.state.content);
    } else {
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
      <form onSubmit={handleSubmit}>
        <input 
          type="text"  
          placeholder="제목을 입력하세요"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* textarea로 수정 */}
        <textarea
          placeholder="내용을 입력하세요"
          className="content-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '400px', resize: 'vertical', marginTop: '10px' }}
        />
        <div className="button-group">
          <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityEditPage;