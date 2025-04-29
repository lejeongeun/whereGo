import { useState } from 'react';
import { createPost } from '../../api/communityApi'; 
import { useNavigate } from 'react-router-dom';
import './CommunityWritePage.css';
import api from '../../api'; // ✨ 추가: 직접 API 호출할 거라 필요

function CommunityWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // ✨ 이미지 파일 상태 추가
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✨ FormData 객체를 생성
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image); // 이미지 파일 추가
    }

    // ✨ API 호출 (createPost 대신 직접 api.post 사용)
    api.post('/community/write', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      alert('글 작성 완료!');
      console.log('✅ 글쓰기 성공', res.data);
      navigate('/community');
    })
    .catch((err) => {
      console.error('❌ 글쓰기 실패:', err);
      alert('글 작성 중 오류가 발생했어요!');
    });
  };

  // ✨ 이미지 파일 선택 핸들러
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

        {/* ✨ 이미지 업로드 input 추가 */}
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
