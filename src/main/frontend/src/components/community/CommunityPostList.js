import CommunityPostItem from './CommunityPostItem';

const posts = [
  {
    id: 1,
    title: '타입체크 관련질문입니다.',
    content: 'npm install -D vue-tsc 했는데 타입체크가 안 돼요.',
    author: '김창훈',
    time: '10분 전',
    likes: 0,
    views: 1,
    comments: 0,
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
