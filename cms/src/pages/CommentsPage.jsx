import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllComments, deleteComment } from '../api/client';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getAllComments(token);
        if (!cancelled) setComments(res.comments || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(postId, commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(postId, commentId, token);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert(err.message || 'Failed to delete comment');
    }
  }

  if (loading) return (
    <div className="loading-container animate-in">
      <div className="spinner"></div>
      <p>Loading comments...</p>
    </div>
  );
  if (error) return <div className="p-xl text-danger">{error}</div>;

  return (
    <div className="dashboard-page animate-in">
      <div className="dashboard-header">
        <h1>Comments</h1>
      </div>

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Comment</th>
              <th>Post Title</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted p-md">No comments yet.</td>
              </tr>
            ) : (
              comments.map(comment => (
                <tr key={comment.id}>
                  <td className="font-medium">{comment.author?.name || 'Anonymous'}</td>
                  <td>
                    <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {comment.content}
                    </div>
                  </td>
                  <td className="text-muted text-sm">{comment.post?.title || 'Unknown Post'}</td>
                  <td className="text-muted text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleDelete(comment.postId, comment.id)} 
                      className="btn-action text-danger"
                    >
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
