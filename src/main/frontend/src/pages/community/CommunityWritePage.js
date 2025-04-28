import { useState } from 'react';
import { createPost } from '../../api/communityApi'; // 백엔드 API 함수 import
import { useNavigate } from 'react-router-dom'; // 글 작성 후 페이지 이동용

function CommunityWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 제출 막기
    console.log("🟢 글쓰기 요청:", { title, content });

    createPost({ title, content })
      .then((res) => {
        alert(res.data);
        console.log("✅ 글쓰기 성공");
        navigate('/community'); // 글 작성 후 커뮤니티 리스트 페이지로 이동
      })
      .catch((err) => {
        console.error("❌ 글쓰기 실패:", err);
        alert('글 작성 중 오류가 발생했어요!');
      });
  };

  return (
    <div className="write-container">
      <h2>글 작성하기</h2>
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
        ></textarea>
        <button type="submit" className="submit-button">작성 완료</button>
      </form>
    </div>
  );
}

export default CommunityWritePage;
