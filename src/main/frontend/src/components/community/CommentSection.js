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

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingStates, setEditingStates] = useState({}); 
  const [editContents, setEditContents] = useState({});    

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const fetchComments = async () => {
    try {
      const res = await api.get(`/community/${postId}/comment/allList`);
      setComments(res.data);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

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
        {currentComments.map((comment) => {
          console.log("🕓 댓글 하나의 createdAt:", comment.createdAt);
          const isEditing = editingStates[comment.commentId] === true;

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
                  <button onClick={() => setEditingStates(prev => ({ ...prev, [comment.commentId]: false }))}>취소</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="comment-header">
                  <span className="comment-nickname">{comment.nickname}</span>
                  <span className="comment-time">{getRelativeTime(comment.createdAt)}</span>
                </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-actions">
                  <button className="edit" onClick={() => startEditing(comment)}>수정</button>
                  <button className="delete" onClick={() => handleDelete(comment.commentId)}>삭제</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
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
    </div>
  );
}

export default CommentSection;
