import axios from 'axios';

// 로그아웃 처리를 위한 유틸리티 함수
const clearAuthData = () => {
  // 1. localStorage에서 모든 인증 관련 데이터 제거
  const keysToRemove = ['token', 'user', 'email', 'nickname'];
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // 추가로 user, auth, login 관련 항목 모두 제거
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('user') || 
      key.includes('member') || 
      key.includes('auth') || 
      key.includes('login')
    )) {
      localStorage.removeItem(key);
    }
  }
  
  // 2. sessionStorage 정리
  sessionStorage.clear();
  
  // 3. 모든 쿠키 삭제
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // 여러 경로에 설정된 쿠키 모두 삭제
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/api`;
  }
  
  // 4. 로그인 상태 변경 이벤트 발생
  window.dispatchEvent(new Event('loginStateChanged'));
};

// API 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  // headers: {
  //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
  // },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // 인증이 필요한 경로
    const authRequiredPaths = [
      '/community/create',
      '/community/update',
      '/community/delete',
      '/comment',
      '/member',
      '/profile',
      '/like'
    ];

    const needsAuth = authRequiredPaths.some(path => config.url?.includes(path));

    if (token && needsAuth) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization']; // 헤더 제거
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 로그아웃 상태 플래그 (중복 로그아웃 방지용)
let isLoggingOut = false;

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    // 예외 처리: community/list는 로그인 없이도 접근 가능
    const isPublicRequest =
    requestUrl?.includes('/community/list') ||
    requestUrl?.includes('/community/posts/');

    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (status === 401 && !isPublicRequest) {
      isLoggingOut = true;

      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // 모든 인증 데이터 삭제
      clearAuthData();
      
      // 사용자에게 알림
      alert('세션이 만료되었거나 서버 연결에 문제가 있습니다. 다시 로그인해주세요.');
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      
      return Promise.reject('세션 만료');
    }
    
    // 서버 연결 문제 (응답 없음)
    if (!error.response) {
      isLoggingOut = true;
      
      // 모든 인증 데이터 삭제
      clearAuthData();
      
      // 사용자에게 알림
      alert('서버 연결에 실패했습니다. 인터넷 연결을 확인하거나 나중에 다시 시도해주세요.');
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      
      return Promise.reject('서버 연결 실패');
    }
    
    // 그 외 에러
    return Promise.reject(
      error.response?.data?.message || '서버 요청 중 오류가 발생했습니다.'
    );
  }
);

export default api;