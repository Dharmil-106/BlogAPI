const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function getComments(postId) {
  const res = await fetch(`${API_BASE}/comments/${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function getAuthorProfile() {
  const res = await fetch(`${API_BASE}/author`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function createComment(postId, content, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}

export async function deleteComment(postId, id, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error('Google login failed');
  return res.json(); // { token }
}