export const logout = () => {
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
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/ws`;
  }
  
  // 4. 로그인 상태 변경 이벤트 발생
  window.dispatchEvent(new Event('loginStateChanged'));
};