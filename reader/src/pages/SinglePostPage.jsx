import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import {
  getPost,
  getComments,
  createComment,
  deleteComment,
  loginWithGoogle,
} from '../api/client';
import './SinglePostPage.css';

export default function SinglePostPage() {
  const { id } = useParams();
  const { user, token, login, logout } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load post + comments
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          getPost(id),
          getComments(id),
        ]);

        if (cancelled) return;

        if (!postRes.post) {
          setNotFound(true);
        } else {
          setPost(postRes.post);
          setComments(commentsRes.comments || []);
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        if (!cancelled) {
          if (err.status === 404) {
            setNotFound(true);
          } else {
            setError(err.message || 'Something went wrong');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleCommentSubmit(content) {
    await createComment(id, content, token);
    // Re-fetch comments after submit
    const updated = await getComments(id);
    setComments(updated.comments || []);
  }

  async function handleCommentDelete(commentId) {
    await deleteComment(id, commentId, token);
    const updated = await getComments(id);
    setComments(updated.comments || []);
  }

async function handleGoogleSuccess(credentialResponse) {
  setIsLoggingIn(true);
  try {
    const res = await loginWithGoogle(credentialResponse.credential);
    login(res.token);
  } catch (err) {
    console.error('Sign-in failed:', err);
    alert(err.message || 'Sign-in failed');
  } finally {
    setIsLoggingIn(false);
  }
}


  function handleSignOut() {
    logout();
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="single-post container" role="status" aria-label="Loading post">
        <div className="single-post__skeleton-title skeleton" />
        <div className="single-post__skeleton-meta skeleton" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="single-post__skeleton-line skeleton" key={i} />
        ))}
      </div>
    );
  }

  // Not found
  if (notFound) {
    return (
      <div className="single-post container">
        <div className="single-post__not-found" id="post-not-found">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/posts" className="single-post__back">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  // Error (non-404)
  if (error) {
    return (
      <div className="single-post container">
        <div className="single-post__not-found" id="post-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <Link to="/posts" className="single-post__back">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="single-post container" id="single-post-page">
      <Link to="/posts" className="single-post__back">
        ← All Posts
      </Link>

      <article>
        <h1 className="single-post__title">{post.title}</h1>

        <div className="single-post__meta">
          <span>{post.author?.name || 'Unknown'}</span>
          <span className="single-post__meta-separator">·</span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="single-post__meta-separator">·</span>
          <span>{getReadTime(post.content)} min read</span>
        </div>

        {post.bannerImg && (
          <img
            src={post.bannerImg}
            alt={post.title}
            className="single-post__banner"
          />
        )}

        <div
          className="single-post__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <CommentSection
        comments={comments}
        user={user}
        isLoggingIn={isLoggingIn}
        onSubmit={handleCommentSubmit}
        onDelete={handleCommentDelete}
        onSignIn={handleGoogleSuccess}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

function getReadTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
