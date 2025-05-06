import { useState, useEffect } from 'react';
import api from '../../api';
import './css/CommentSection.css';
import { updateComment, deleteComment } from '../../api/communityApi';

function getRelativeTime(createdAt) {
  if (!createdAt) return '시간 정보 없음';
  const createdDate = new Date(createdAt);
  if (isNaN(createdDate)) return '시간 형식 오류';

  const now = new Date();
  const diffMs = now - createdDate;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return `${diffSeconds}초 전`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return createdDate.toISOString().slice(0, 10);
}

function getFormattedTime(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingStates, setEditingStates] = useState({}); 
  const [editContents, setEditContents] = useState({});    
  const [showMenuId, setShowMenuId] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(localStorage.getItem('email') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const fetchComments = async () => {
    try {
      const res = await api.get(`/community/${postId}/comment/allList`);
      setComments(res.data.reverse());
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const handleLoginStateChange = () => {
      const updatedEmail = localStorage.getItem('email') || '';
      console.log('📢 [loginStateChanged] 업데이트된 email:', updatedEmail);
      setLoggedInEmail(updatedEmail);
    };
  
    window.addEventListener('loginStateChanged', handleLoginStateChange);
    return () => {
      window.removeEventListener('loginStateChanged', handleLoginStateChange);
    };
  }, []);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      alert('댓글을 입력하세요.');
      return;
    }

    try {
      await api.post(`/community/${postId}/comment/create`, {
        content: newComment,
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const startEditing = (comment) => {
    setEditingStates(prev => ({ ...prev, [comment.commentId]: true }));
    setEditContents(prev => ({ ...prev, [comment.commentId]: comment.content }));
  };

  const handleEditSubmit = (id) => {
    updateComment(postId, id, { content: editContents[id] })
      .then(() => {
        fetchComments();
        setEditingStates(prev => ({ ...prev, [id]: false }));
        setEditContents(prev => ({ ...prev, [id]: '' }));
      })
      .catch(err => {
        console.error("댓글 수정 실패", err);
        alert("댓글 수정 중 오류 발생");
      });
  };

  const toggleMenu = (id) => {
    setShowMenuId(prev => (prev === id ? null : id));
  };

  const handleDelete = (commentId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    deleteComment(postId, commentId)
      .then(() => {
        fetchComments();
      })
      .catch(err => {
        console.error("댓글 삭제 실패", err);
        alert("댓글 삭제 중 오류 발생");
      });
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  return (
    <>
    <div className="comment-divider"></div>
    <div className="comment-section">
      <h3>댓글</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">등록</button>
      </form>
      

      <ul className="comment-list">
        {
        comments.length === 0 ? (
          <p className="no-comments">댓글이 없습니다.</p>
        ) : (
        
        currentComments.map((comment) => {
          const isEditing = editingStates[comment.commentId] === true;

          console.log('🔎 comment.email:', comment.email);
          console.log('🔎 loggedInEmail:', loggedInEmail);
          console.log('🔎 canEditOrDelete:', comment.email === loggedInEmail);

          return (
            <li key={comment.commentId} className="comment-item">
  {isEditing ? (
    <>
      <textarea
        value={editContents[comment.commentId] || ''}
        onChange={(e) =>
          setEditContents(prev => ({
            ...prev,
            [comment.commentId]: e.target.value,
          }))
        }
      />
      <div className="comment-actions">
        <button onClick={() => handleEditSubmit(comment.commentId)}>저장</button>
        <button onClick={() =>
          setEditingStates(prev => ({
            ...prev,
            [comment.commentId]: false,
          }))
        }>취소</button>
      </div>
    </>
  ) : (
    <>
<div className="comment-header">
  <div className="comment-header-top">
    <span className="comment-nickname">{comment.nickname}</span>

    {loggedInEmail === comment.email && (
      <div className="comment-more-container">
        <button className="comment-more-button" onClick={() => toggleMenu(comment.commentId)}>⋯</button>
        {showMenuId === comment.commentId && (
          <div className="comment-more-menu">
            <button onClick={() => startEditing(comment)}>수정</button>
            <button onClick={() => handleDelete(comment.commentId)}>삭제</button>
          </div>
        )}
      </div>
    )}
  </div>

  <div className="comment-time-under">
    {getFormattedTime(comment.createdAt)}
  </div>
</div>

<div className="comment-content">{comment.content}</div>

    </>
  )}
</li>
          );
        })
      )}
      </ul>

      {comments.length > 0 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>이전</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>다음</button>
        </div>
      )}
    </div>
    </>
  );
}

export default CommentSection;
