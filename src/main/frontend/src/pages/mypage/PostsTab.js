import React, { useState } from 'react';

const PostsTab = ({ posts, navigate }) => {
  // 페이징 처리
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const sortedPosts = [...(posts || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 게시글 상세 페이지로 이동
  const navigateToCommunityDetail = (postId) => {
    navigate(`/community/${postId}`);
  };

  return (
    <div className="community-section">
      <h2>내가 작성한 글</h2>
      {totalPosts > 0 ? (
        <>
          <div className="community-list">
            {currentPosts.map((post, index) => (
              <div key={post.id} className="community-item">
                <h3 
                  className="post-title clickable" 
                  onClick={() => navigateToCommunityDetail(post.id)}
                >
                  {post.title}
                </h3>
                <p className="post-content">{post.content}</p>
                <div className="post-info">
                  <span className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {index < currentPosts.length - 1 && <div className="post-divider"></div>}
              </div>
            ))}
          </div>

          {/* 페이지 버튼 */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="no-posts">작성한 글이 없습니다.</p>
      )}
    </div>
  );
};

export default PostsTab;