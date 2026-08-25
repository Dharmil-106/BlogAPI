import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PostList from '../components/PostList';
import { getPosts } from '../api/client';
import './HomePage.css';

export default function HomePage() {
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
    <div className="home-page container" id="home-page">
      <HeroSection />

      <section>
        <div className="home-page__section-header">
          <h2 className="home-page__section-title">Recent Posts</h2>
          <Link to="/posts" className="home-page__view-all">
            View all →
          </Link>
        </div>
        {error ? (
          <p className="text-muted" style={{ padding: 'var(--space-md) 0' }}>
            Failed to load posts.
          </p>
        ) : (
          <PostList posts={posts} limit={4} loading={loading} />
        )}
      </section>
    </div>
  );
}
