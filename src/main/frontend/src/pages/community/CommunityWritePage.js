function CommunityWritePage() {
    return (
      <div className="write-container">
        <h2>글 작성하기</h2>
        <form>
          <input type="text" placeholder="제목을 입력하세요" className="title-input" />
          <textarea placeholder="내용을 입력하세요" className="content-textarea"></textarea>
          <button type="submit" className="submit-button">작성 완료</button>
        </form>
      </div>
    );
  }
  
  export default CommunityWritePage;
  