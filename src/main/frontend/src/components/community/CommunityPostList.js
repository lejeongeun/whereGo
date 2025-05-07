import { useState } from 'react';
import CommunityPostItem from './CommunityPostItem';
import './css/CommunityPostList.css';

function CommunityPostList({ posts, isSearching }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts">
        {isSearching ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
      </div>
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="post-list">
      {currentPosts.map(post => (
        <CommunityPostItem key={post.id} {...post} />
      ))}

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          이전
        </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)} 
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
    
  );
}

export default CommunityPostList;
