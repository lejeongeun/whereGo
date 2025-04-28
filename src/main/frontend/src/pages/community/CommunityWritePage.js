import { useRef, useState, useEffect } from 'react';
import { createPost } from '../../api/communityApi';
import { useNavigate } from 'react-router-dom'; 
import './CommunityWritePage.css';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function CommunityWritePage() {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const content = editorRef.current.getInstance().getMarkdown();

    createPost({ title, content })
      .then((res) => {
        alert(res.data);
        console.log("✅ 글쓰기 성공");
        navigate('/community'); 
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
        <Editor
          ref={editorRef}
          initialValue=""
          placeholder="내용을 입력하세요"
          previewStyle="vertical"  
          height="400px"
          initialEditType="wysiwyg"  
          useCommandShortcut={true}
          hideModeSwitch={true}  
        />
        <div className="button-group">
          <button type="submit" className="submit-button">작성 완료</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityWritePage;
