import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { getInitial } from '../utils/avatar';
import './CommentSection.css';

/**
 * Comment section with inline auth.
 *
 * @param {Object}   props
 * @param {Array}    props.comments  — array of comment objects
 * @param {Object|null} props.user   — current user ({ id, role }) or null
 * @param {Function} props.onSubmit  — (content: string) => void
 * @param {Function} props.onDelete  — (commentId: string) => void
 * @param {Function} props.onSignIn  — () => void (Google sign-in)
 * @param {Function} props.onSignOut — () => void
 */
export default function CommentSection({
  comments = [],
  user = null,
  isLoggingIn = false,
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
          {isLoggingIn ? (
            <div className="comments__loading-spinner">Signing in...</div>
          ) : (
            <GoogleLogin
              onSuccess={onSignIn}
              onError={() => console.error('Google login failed')}
            />
          )}
        </div>
      ) : (
        <>
          <div className="comments__form-header">
            <div className="comments__user-info">
              <div className="comments__avatar" id="user-avatar">
                {user.pfp ? (
                  <img src={user.pfp} alt={user.name} />
                ) : user.name ? (
                  getInitial(user.name)
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="14" height="14">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <span className="comments__user-name">
                {user.name ? `Signed in as ${user.name}` : 'Signed in'}
              </span>
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
