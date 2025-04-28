import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { editPost } from '../../api/communityApi'; 
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import api from '../../api';
import './CommunityEditPage.css';

function CommunityEditPage() {
  const { id } = useParams();               
  const navigate = useNavigate();
  const location = useLocation();           
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const editorRef = useRef();

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

  useEffect(() => {
    if(editorRef.current) {
      editorRef.current.getInstance().setMarkdown(content || '');
    }
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedContent = editorRef.current.getInstance().getMarkdown();

    api.put(`/community/${id}/edit`, { title, content: updatedContent })
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
        <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </div>
  );
}

export default CommunityEditPage;
