// // CommunityPage.js
// import { useState, useEffect } from 'react';
// import CommunitySearch from '../../components/community/CommunitySearch';
// import CommunitySortTabs from '../../components/community/CommunitySortTabs';
// import CommunityPostList from '../../components/community/CommunityPostList';
// import './CommunityPage.css';
// import api from '../../api';

// function CommunityPage() {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [sortOrder, setSortOrder] = useState('최신순');  // 기본적으로 최신순

//   useEffect(() => {
//     api.get('/community/list')
//       .then(res => {
//         setPosts(res.data);
//         setFilteredPosts(res.data);
//       })
//       .catch(err => console.error('게시글 불러오기 실패:', err));
//   }, []);

//   // 정렬 기준에 따라 필터링
//   const handleSort = (criteria) => {
//     setSortOrder(criteria);
//     let sortedPosts = [...posts];
//     if (criteria === '최신순') {
//       sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬
//     } else if (criteria === '답변많은순') {
//       sortedPosts.sort((a, b) => b.commentCount - a.commentCount); // 답변 많은 순 정렬
//     } else if (criteria === '좋아요순') {
//       sortedPosts.sort((a, b) => b.likeCount - a.likeCount); // 좋아요 많은 순 정렬
//     }
//     setFilteredPosts(sortedPosts); // 정렬된 게시물 상태로 업데이트
//   };

//   const handleSearch = (keyword) => {
//     if (!keyword) {
//       setFilteredPosts(posts);
//       return;
//     }
//     const result = posts.filter(p => 
//       p.title.includes(keyword) || p.content.includes(keyword)
//     );
//     setFilteredPosts(result);
//   };

//   return (
//     <div className="community-container">
//       <CommunitySearch onSearch={handleSearch} />
//       <div className="top-bar">
//         <CommunitySortTabs onSort={handleSort} /> {/* 정렬 기준을 전달받음 */}
//       </div>
//       <div className="content-wrapper">
//         <div className="left-content">
//           <CommunityPostList posts={filteredPosts} />
//         </div>
//         <div className="right-sidebar">
//           <h3>인기 게시물</h3>
//           {/* 인기 게시물 3개 표시 */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CommunityPage;
