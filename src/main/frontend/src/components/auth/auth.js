export const logout = async () => {
  try {
    await fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      credentials: 'include', // ← 쿠키 포함하여 요청
    });
  } catch (err) {
    console.error('로그아웃 요청 실패:', err);
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');
};