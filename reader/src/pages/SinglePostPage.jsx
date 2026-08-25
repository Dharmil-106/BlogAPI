import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import {
  fetchPost,
  fetchComments,
  createComment,
  deleteComment,
  getCurrentUser,
  googleSignIn,
  signOut,
} from '../api/client';
import './SinglePostPage.css';

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load post + comments + current user
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [postData, commentsData] = await Promise.all([
          fetchPost(id),
          fetchComments(id),
        ]);

        if (cancelled) return;

        if (!postData) {
          setNotFound(true);
        } else {
          setPost(postData);
          setComments(commentsData);
        }

        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load post:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleCommentSubmit(content) {
    await createComment(id, content);
    // Re-fetch comments after submit
    const updated = await fetchComments(id);
    setComments(updated);
  }

  async function handleCommentDelete(commentId) {
    await deleteComment(id, commentId);
    const updated = await fetchComments(id);
    setComments(updated);
  }

  async function handleSignIn() {
    await googleSignIn();
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
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
        onSubmit={handleCommentSubmit}
        onDelete={handleCommentDelete}
        onSignIn={handleSignIn}
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
