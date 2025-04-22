// src/api.js
import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api', // Vite 프록시 설정에 맞춘 기본 URL
  withCredentials: true, // 세션 쿠키(JSESSIONID)를 포함하기 위해 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청 전에 실행
api.interceptors.request.use(
  (config) => {
    // 세션 기반 인증에서는 JSESSIONID가 쿠키에 자동 포함됨
    // 추가적인 요청 헤더 설정이 필요하면 여기서 처리
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 모든 응답 후 실행
api.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 세션 만료 또는 인증 오류 처리 (401 Unauthorized)
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로 리디렉션
      // React Router의 navigate를 직접 사용할 수 없으므로 window.location 사용
      window.location.href = '/login';
      // 사용자에게 알림 (선택 사항)
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
    }
    // 에러 메시지를 호출한 컴포넌트로 전달
    return Promise.reject(
      error.response?.data?.message || '서버 요청 중 오류가 발생했습니다.'
    );
  }
);

export default api;