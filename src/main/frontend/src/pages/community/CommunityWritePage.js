import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CommunityWritePage.css';
import api from '../../api'; 

function CommunityWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); 
  const [previewUrls, setPreviewUrls] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    images.forEach((img) => {
      formData.append('image', img); // 여러 장 첨부
    });

    api.post('/community/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      alert('게시글이 생성되었습니다.');
      navigate('/community/');
    })
    .catch((err) => {
      console.error('게시글 생성 실패:', err);
      alert('생성 중 오류가 발생했습니다.');
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
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
        />

        {/* 이미지 업로드 input */}
      
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden-file-input"
        />

        {/* 이미지 미리보기 */}
        <div className="image-preview-section">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="image-preview">
              <img src={url} alt={`미리보기-${idx}`} />
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">작성 완료</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityWritePage;
