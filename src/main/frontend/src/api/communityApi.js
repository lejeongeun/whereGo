import api from '../api';
// 글 목록 불러오기
export const getPosts = () => api.get('/community/list');

// 새 글 작성
export const createPost = (data) => api.post('/community/create', data);

// 글 상세 조회 (예시)
export const getPostById = (id) => api.get(`/community/${id}`);

// 글 삭제
export const deletePost = (id) => api.delete(`/community/${id}/delete`);

// 댓글 수정
export const updateComment = (communityId, commentId, data) => api.put(`/community/${communityId}/comment/${commentId}/edit`, data);
  
// 댓글 삭제
export const deleteComment = (communityId, commentId) => api.delete(`/community/${communityId}/comment/${commentId}/delete`);