function CommunitySortTabs() {
    const tabs = ["최신순", "정확도순", "답변많은순", "좋아요순"];
  
    return (
      <div className="sort-tabs">
        {tabs.map((tab) => (
          <button key={tab} className="tab-btn">
            {tab}
          </button>
        ))}
      </div>
    );
  }
  
  export default CommunitySortTabs;