import CommunitySearch from "../components/CommunitySearch";
import CommunitySortTabs from "../components/CommunitySortTabs";
import CommunityPostList from "../components/CommunityPostList";

function Community() {
  return (
    <div className="community-container">
      <CommunitySearch />
      <div className="top-bar">
        <CommunitySortTabs />
        <button className="write-button">글쓰기</button>
      </div>
      <CommunityPostList />
    </div>
  );
}

export default Community;