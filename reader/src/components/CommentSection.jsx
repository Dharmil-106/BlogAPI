import { useState } from 'react';
import './CommentSection.css';

/**
 * Comment section with inline auth.
 *
 * @param {Object}   props
 * @param {Array}    props.comments  — array of comment objects
 * @param {Object|null} props.user   — current user (null if not logged in)
 * @param {Function} props.onSubmit  — (content: string) => void
 * @param {Function} props.onDelete  — (commentId: string) => void
 * @param {Function} props.onSignIn  — () => void (Google sign-in)
 * @param {Function} props.onSignOut — () => void
 */
export default function CommentSection({
  comments = [],
  user = null,
  onSubmit,
  onDelete,
  onSignIn,
  onSignOut,
}) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setText('');
  }

  return (
    <section className="comments" id="comments-section">
      <h2 className="comments__heading">
        Comments
        <span className="comments__count">({comments.length})</span>
      </h2>

      {/* ─── Auth / Form ─── */}
      {!user ? (
        <div className="comments__auth-prompt" id="comments-auth-prompt">
          <p className="comments__auth-text">
            Sign in to join the conversation.
          </p>
          <button
            className="comments__google-btn"
            onClick={onSignIn}
            type="button"
            id="google-sign-in-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div className="comments__form-header">
            <div className="comments__user-info">
              <div className="comments__avatar" id="user-avatar">
                {user.pfp ? (
                  <img src={user.pfp} alt={user.name} />
                ) : (
                  getInitial(user.name)
                )}
              </div>
              <span className="comments__user-name">{user.name}</span>
            </div>
            <button
              className="comments__sign-out"
              onClick={onSignOut}
              type="button"
              id="sign-out-btn"
            >
              Sign out
            </button>
          </div>

          <form className="comments__form" onSubmit={handleSubmit} id="comment-form">
            <textarea
              className="comments__textarea"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              id="comment-textarea"
            />
            <button
              type="submit"
              className="comments__submit"
              disabled={!text.trim()}
              id="comment-submit-btn"
            >
              Post comment
            </button>
          </form>
        </>
      )}

      {/* ─── Comment list ─── */}
      {comments.length > 0 ? (
        <div className="comments__list">
          {comments.map((comment) => (
            <div className="comment" key={comment.id} id={`comment-${comment.id}`}>
              <div className="comment__avatar">
                {comment.author?.pfp ? (
                  <img src={comment.author.pfp} alt={comment.author?.name} />
                ) : (
                  getInitial(comment.author?.name)
                )}
              </div>
              <div className="comment__body">
                <div className="comment__header">
                  <span className="comment__author">
                    {comment.author?.name || 'Anonymous'}
                  </span>
                  <span className="comment__time">
                    {formatCommentDate(comment.createdAt)}
                  </span>
                  {user && user.id === comment.authorId && (
                    <button
                      className="comment__delete"
                      onClick={() => onDelete?.(comment.id)}
                      type="button"
                      aria-label="Delete comment"
                    >
                      delete
                    </button>
                  )}
                </div>
                <p className="comment__content">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="comments__empty">No comments yet. Be the first to share your thoughts.</p>
      )}
    </section>
  );
}

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function formatCommentDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
