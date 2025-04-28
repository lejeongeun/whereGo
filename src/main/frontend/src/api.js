import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청 전에 실행
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 세션 만료 또는 인증 오류 처리 (401 Unauthorized)
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로 리디렉션
      // React Router의 navigate를 직접 사용할 수 없으므로 window.location 사용
      window.location.href = '/login';
      // 사용자에게 알림 (선택 사항)
      alert('세션 만료 혹은 로그인 정보가 일치하지 않습니다');
    }
    // 에러 메시지를 호출한 컴포넌트로 전달
    return Promise.reject(
      error.response?.data?.message || '서버 요청 중 오류가 발생했습니다.'
    );
  }
);
export default api;