import { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import { getPosts } from '../api/client';
import './PostsPage.css';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getPosts();
        if (!cancelled) setPosts(data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="posts-page container" id="posts-page">
      <div className="posts-page__header">
        <h1 className="posts-page__title">All Posts</h1>
        {!loading && !error && (
          <span className="posts-page__count">{posts.length} posts</span>
        )}
      </div>
      {error ? (
        <p className="text-muted" style={{ padding: 'var(--space-md) 0' }}>
          Failed to load posts.
        </p>
      ) : (
        <PostList posts={posts} loading={loading} />
      )}
    </div>
  );
}
