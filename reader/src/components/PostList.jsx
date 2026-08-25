import { Link } from 'react-router-dom';
import './PostList.css';

/**
 * Renders posts in a git-commit-log style list.
 *
 * @param {Object} props
 * @param {Array}  props.posts    — array of post objects
 * @param {number} [props.limit]  — max posts to show (optional)
 * @param {boolean} [props.loading] — show skeleton state
 */
export default function PostList({ posts = [], limit, loading = false }) {
  if (loading) {
    return (
      <div className="post-list" role="status" aria-label="Loading posts">
        {Array.from({ length: limit || 4 }).map((_, i) => (
          <div className="post-list__skeleton-row" key={i}>
            <div className="post-list__marker">
              <span className="post-list__skeleton-dot skeleton" />
              <span className="post-list__skeleton-hash skeleton" />
            </div>
            <span className="post-list__skeleton-title skeleton" />
            <span className="post-list__skeleton-meta skeleton" />
            <span className="post-list__skeleton-date skeleton" />
          </div>
        ))}
      </div>
    );
  }

  const displayed = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="post-list">
      {displayed.map((post) => (
        <Link
          to={`/posts/${post.id}`}
          className="post-list__row"
          key={post.id}
          id={`post-row-${post.id}`}
        >
          <div className="post-list__marker">
            <span className="post-list__dot" />
            <span className="post-list__hash">{post.id.slice(-6)}</span>
          </div>
          <span className="post-list__title">{post.title}</span>
          <span className="post-list__meta">{getReadTime(post.content)} min read</span>
          <span className="post-list__date">{formatDate(post.createdAt)}</span>
        </Link>
      ))}
    </div>
  );
}

/** Estimate reading time from HTML content string (~200 wpm) */
function getReadTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format ISO date to "Mon DD" or "Mon DD, YYYY" if not current year */
function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  if (date.getFullYear() !== now.getFullYear()) {
    return `${month} ${day}, ${date.getFullYear()}`;
  }
  return `${month} ${day}`;
}
