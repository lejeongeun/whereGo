import { useRef, useState, useEffect } from 'react';
import { createPost } from '../../api/communityApi'; // 이 부분은 이미 존재
import api from '../../api'; // 추가: api import
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

  // Editor에서 이미지 업로드 처리
  const uploadImageCallback = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return new Promise((resolve, reject) => {
      // 이미지 업로드 API 호출
      api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl; // 서버에서 반환된 이미지 URL
        resolve(imageUrl); // 이미지 URL을 resolve
      })
      .catch((error) => {
        reject(error);
      });
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
        
        {/* Toast UI Editor */}
        <Editor
          ref={editorRef}
          initialValue=""
          placeholder="내용을 입력하세요"
          previewStyle="vertical"  
          height="400px"
          initialEditType="wysiwyg"  
          useCommandShortcut={true}
          hideModeSwitch={true}
          // 이미지 업로드 콜백 함수 추가
          hooks={{
            addImageBlobHook: uploadImageCallback,
          }}
        />
        <div className="button-group">
          <button type="submit" className="submit-button">작성 완료</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityWritePage;
