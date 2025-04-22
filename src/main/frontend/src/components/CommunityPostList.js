import CommunityPostItem from "./CommunityPostItem";

const dummyPosts = [
  {
    id: 1,
    title: "Main Branch 자동 생성 안됨",
    content: "git push origin main명령어 실행 시, 오류 발생하여 해결 방법 문의 드립니다...",
    tags: ["git", "github", "gitlab"],
    author: "다솔",
    time: "46분 전",
    likes: 0,
    views: 8,
    comments: 2,
  },
  {
    id: 2,
    title: "ㅇㅇㅇ",
    content: "ㅋㅋㅋㅋ",
    tags: [],
    author: "지구에서우주끝까지",
    time: "44분 전",
    likes: 0,
    views: 4,
    comments: 0,
  },
];

function CommunityPostList() {
  return (
    <div className="post-list">
      {dummyPosts.map((post) => (
        <CommunityPostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default CommunityPostList;