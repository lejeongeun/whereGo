import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import './css/CommunityEditPage.css';

function CommunityEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    api.get(`/community/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setExistingImages(res.data.imageUrls); // 이제 { id, url } 객체 배열
      })
      .catch(err => console.error('❌ 가져오기 실패:', err));
  }, [id]);

  const handleImageDeleteToggle = (id) => {
    setDeleteImageIds(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };


      const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);        // 선택한 파일들을 배열로 바꿈
        setNewImages(files);                              // 선택한 파일들 상태 저장
        const previewUrls = files.map(file => URL.createObjectURL(file)); // 미리보기 주소 생성
        setNewImagePreviews(previewUrls);                // 화면에 보여줄 미리보기 주소 저장
      };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    // 새로 추가한 이미지들
    newImages.forEach(img => formData.append('images', img));

    // 삭제할 이미지 ID들
    formData.append(
      "deleteImageIds",
      new Blob([JSON.stringify(deleteImageIds)], { type: "application/json" })
    );
    
    api.put(`/community/${id}/edit`, formData)
  .then(() => {
    alert('게시글이 수정되었습니다.');
    navigate(`/community/${id}?fromEdit=true`);
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
          {existingImages.map((img, index) => (
            <div key={img.id} className="image-preview">
              <img src={`http://localhost:8080${img.url}`} alt={`기존-${index}`} />
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleImageDeleteToggle(img.id)}
                  checked={deleteImageIds.includes(img.id)}
                /> 삭제
              </label>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImageChange}
          className="hidden-file-input"
        />

        <div className="image-preview-section">
          {newImagePreviews.map((url, idx) => (
            <div key={idx} className="image-preview">
              <img src={url} alt={`새 이미지 ${idx}`} />
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityEditPage;