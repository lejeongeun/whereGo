import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      alert('세션 만료 혹은 로그인 정보가 일치하지 않습니다');
    }
    return Promise.reject(
      error.response?.data?.message || '서버 요청 중 오류가 발생했습니다.'
    );
  }
);
export default api;