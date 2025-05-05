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
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title);
      setContent(location.state.content);
      api.get(`/community/${id}`).then(res => setExistingImages(res.data.imageUrls));
    } else {
      api.get(`/community/${id}`).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setExistingImages(res.data.imageUrls);
      });
    }
  }, [id, location.state]);

  const handleImageDeleteToggle = (url) => {
    const fileName = url.split('/').pop();
    setDeleteImageIds(prev =>
      prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    // 새로 추가한 이미지들
    newImages.forEach(img => formData.append('images', img));

    // 삭제할 이미지 ID들
    deleteImageIds.forEach(id => formData.append('deleteImageIds', id));

    api.put(`/community/${id}/edit`, formData)
      .then(() => {
        alert('게시글이 수정되었습니다.');
        navigate(`/community/${id}`);
      })
      .catch(err => {
        console.error('수정 실패:', err);
        alert('수정 중 오류 발생');
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
        <textarea
          placeholder="내용을 입력하세요"
          className="content-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="image-preview-section">
          {existingImages.map((url, index) => (
            <div key={index} className="image-preview">
              <img
                src={`http://localhost:8080${url}`}
                alt={`기존이미지-${index}`}
              />
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleImageDeleteToggle(url)}
                  checked={deleteImageIds.includes(url.split('/').pop())}
                /> 삭제
              </label>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setNewImages(Array.from(e.target.files))}
        />

        <div className="button-group">
          <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityEditPage;