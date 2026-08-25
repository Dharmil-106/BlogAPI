const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json(); // { token }
}

export async function getAllPosts(token) {
  const res = await fetch(`${API_BASE}/posts`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function createPost(data, token) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id, data, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}

export async function togglePublish(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}/publish`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to toggle publish');
  return res.json();
}

export async function getAllComments(token) {
  const res = await fetch(`${API_BASE}/comments`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function getPostComments(postId, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch post comments');
  return res.json();
}

export async function deleteComment(postId, id, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

export async function getAuthorProfile() {
  const res = await fetch(`${API_BASE}/author`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateAuthorProfile(data, token) {
  const res = await fetch(`${API_BASE}/author`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function uploadImage(file, token, filename) {
  const formData = new FormData();
  formData.append('image', file, filename || file.name || 'image.jpg');
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(token), // don't set Content-Type manually — browser sets it with the correct boundary for FormData
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json(); // { url }
}