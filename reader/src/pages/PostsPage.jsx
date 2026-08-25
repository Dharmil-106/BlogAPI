import { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import { fetchPosts } from '../api/client';
import './PostsPage.css';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPosts();
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
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
        {!loading && (
          <span className="posts-page__count">{posts.length} posts</span>
        )}
      </div>
      <PostList posts={posts} loading={loading} />
    </div>
  );
}
