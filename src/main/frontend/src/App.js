import './App.css';

function App() {
  return (
    <div className="WhereGo">
      <div className="MainTop">
      {/* 상단 바 */}
      <header>
        <h1 className="Logo">어디GO</h1>
        <div className="Join">
          <button className="Login">로그인</button>
          <button className="SignUp">회원가입</button>
        </div>
      </header>

      {/* 본문 영역 */}
      <div className="Main">
        {/* 왼쪽 카테고리 바 */}
        <aside className="Category">
          <nav className="Clist">
            <button className="SList">1. 일정 리스트</button>
            <button className="Exchange">2. 나라별 환율</button>
            <button className="CheckList">3. 체크리스트</button>
            <button className="Community">4. 커뮤니티</button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 - 이미지 영역 */}
        <main className="MainImg">
          {/* 추가 콘텐츠나 오버레이가 필요하면 여기에 작성 */}
        </main>
      </div>
    </div>
    </div>
  );
}

export default App;