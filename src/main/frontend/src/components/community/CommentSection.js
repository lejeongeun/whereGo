import { useState, useEffect } from 'react';
import api from '../../api'; 
import './'

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await api.get(`/community/${postId}/comment/allList`);
      console.log('받은 댓글 데이터:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 등록
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
      fetchComments(); // 댓글 등록 후 다시 불러오기
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록 실패했습니다.');
    }
  };

  return (
    <div>
      <h3>댓글</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">등록</button>
      </form>

      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            {comment.email} : {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;
