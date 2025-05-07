export const clearAllAuthData = () => {
    // 1. 로컬 스토리지에서 모든 인증 관련 데이터 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    
    // 2. 세션 스토리지 데이터 삭제
    sessionStorage.removeItem('redirectAfterLogin');
    
    // 3. 모든 쿠키 삭제
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // 모든 쿠키 만료 처리 (path와 domain 옵션을 정확히 맞춰야 함)
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      // 다른 path에 설정된 쿠키도 처리
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/api`;
    }
    
    // 4. 애플리케이션 상태 초기화 (Redux 사용 시)
    // Redux 스토어를 사용하는 경우 아래 주석을 해제하고 사용
    // import store from '../store';
    // store.dispatch({ type: 'RESET_APP' });
  };