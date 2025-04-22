// CommunityDetailPage.js
import './CommunityDetailPage.css';

function CommunityDetailPage() {
  return (
    <div className="detail-container">
      <h2 className="detail-title">타입체크 관련 질문입니다.</h2>
      <div className="detail-meta">
        <span className="author">김창훈</span>
        <span className="time">10분 전</span>
      </div>
      <div className="detail-content">
        <p>
          npm install -D vue-tsc 했는데 타입체크가 안 돼요. 방법 아시는 분 계실까요?
        </p>
      </div>
      <div className="detail-stats">
        <span>👍 좋아요 0</span>
        <span>👁 조회수 1</span>
        <span>💬 댓글 0</span>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
