import CommunityPostItem from './CommunityPostItem';

const posts = [
  {
    id: 1,
    title: '타입체크 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '김창훈',
    time: '10분 전',
    likes: 5,
    views: 10,
    comments: 3,
  },
  {
    id: 2,
    title: '자바 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '강감찬',
    time: '10분 전',
    likes: 5,
    views: 10,
    comments: 3,
  },
  {
    id: 3,
    title: 'C언어 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '홍길동',
    time: '10분 전',
    likes: 5,
    views: 10,
    comments: 3,
  },
  {
    id: 4,
    title: '파이썬 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '더조은',
    time: '10분 전',
    likes: 5,
    views: 10,
    comments: 3,
  },
  {
    id: 5,
    title: 'SQL 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '김영한',
    time: '10분 전',
    likes: 5,
    views: 10,
    comments: 3,
  },
];

function CommunityPostList() {
  return (
    <div>
      {posts.map((post, index) => (
        <CommunityPostItem key={index} {...post} />
      ))}
    </div>
  );
}
export default CommunityPostList;
