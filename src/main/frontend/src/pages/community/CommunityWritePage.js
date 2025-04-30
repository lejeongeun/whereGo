import { useState } from 'react';
import { createPost } from '../../api/communityApi'; 
import { useNavigate } from 'react-router-dom';
import './css/CommunityWritePage.css';
import api from '../../api'; 

function CommunityWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image); 
    }

    api.post('/community/create', formData, {
      headers: {'Content-Type': 'multipart/form-data'}

    })
    .then(() => {
      alert('게시글이 수정되었습니다.');
      navigate('/community/');
    })
    .catch((err) => {
      console.error('게시글 수정 실패:', err);
      alert('수정 중 오류가 발생했습니다.');
    });
};

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="write-container">
      <h2>글 작성하기</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          style={{ width: '100%', height: '400px', resize: 'vertical', marginTop: '10px' }}
        />

        {/* 이미지 업로드 input 추가 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-input"
          style={{ marginTop: '10px' }}
        />

        <div className="button-group">
          <button type="submit" className="submit-button">작성 완료</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityWritePage;
