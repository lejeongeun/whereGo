import CommunitySearch from '../../components/community/CommunitySearch';
import CommunitySortTabs from '../../components/community/CommunitySortTabs';
import CommunityPostList from '../../components/community/CommunityPostList';
import './CommunityPage.css';

function CommunityPage() {
  return (
    <div className="community-container">
      <CommunitySearch />
      <div className="top-bar">
        <CommunitySortTabs />
      </div>
      <CommunityPostList />
    </div>
  );
}

export default CommunityPage;