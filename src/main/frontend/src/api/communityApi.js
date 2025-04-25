// src/api/communityApi.js
import api from '../api'; // 너가 방금 보여준 axios 인스턴스

// 글 목록 불러오기
export const getPosts = () => api.get('/community/list');

// 새 글 작성
export const createPost = (data) => api.post('/community/create', data);

// 글 상세 조회 (예시)
export const getPostById = (id) => api.get(`/community/posts/${id}`);
