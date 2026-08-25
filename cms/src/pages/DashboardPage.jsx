import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts, deletePost, togglePublish } from '../api/client';
import './DashboardPage.css';

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function fetchPosts() {
      try {
        // Assuming getPosts() in CMS client fetches ALL posts including drafts
        const res = await getAllPosts(token); 
        if (!cancelled) setPosts(res.posts || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load posts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id, token);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  }

  async function handleTogglePublish(id, currentStatus) {
    setTogglingId(id);
    try {
      const res = await togglePublish(id, token);
      setPosts(posts.map(p => p.id === id ? res.post : p));
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status');
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) return (
    <div className="loading-container animate-in">
      <div className="spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );
  if (error) return <div className="p-xl text-danger">{error}</div>;

  return (
    <div className="dashboard-page animate-in">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/posts/new" className="btn-primary">
          + New Post
        </Link>
      </div>

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted p-md">No posts yet.</td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id}>
                  <td className="font-medium">{post.title}</td>
                  <td>
                    <span className={`status-badge ${post.published ? 'status-badge--published' : 'status-badge--draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      className="btn-action"
                      title={post.published ? 'Unpublish' : 'Publish'}
                      disabled={togglingId === post.id}
                    >
                      {togglingId === post.id ? 'Wait...' : (post.published ? 'Hide' : 'Publish')}
                    </button>
                    <Link to={`/posts/${post.id}/edit`} className="btn-action">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="btn-action text-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
