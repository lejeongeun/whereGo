function CommunityPostItem({ post }) {
    return (
      <div className="post-item">
        <div className="post-status">미해결</div>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <div className="tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="meta">
          <span>{post.author} · {post.time}</span>
          <span>
            👍 {post.likes} 👁 {post.views} 💬 {post.comments}
          </span>
        </div>
      </div>
    );
  }
  
  export default CommunityPostItem;