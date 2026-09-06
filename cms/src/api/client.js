const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse(res) {
  const body = await res.json();

  if (!body.success) {
    const err = new Error(body.error || 'Request failed');
    if (body.errors) err.errors = body.errors;
    err.status = res.status;
    throw err;
  }

  return body.data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function getAllPosts(token) {
  const res = await fetch(`${API_BASE}/posts`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function getPost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function createPost(data, token) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updatePost(id, data, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deletePost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function togglePublish(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}/publish`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function getAllComments(token) {
  const res = await fetch(`${API_BASE}/comments`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function getPostComments(postId, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function deleteComment(postId, id, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function getAuthorProfile() {
  const res = await fetch(`${API_BASE}/author`);
  return handleResponse(res);
}

export async function updateAuthorProfile(data, token) {
  const res = await fetch(`${API_BASE}/author`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function uploadImage(file, token, filename) {
  const formData = new FormData();
  formData.append('image', file, filename || file.name || 'image.jpg');
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(token), // don't set Content-Type manually — browser sets it with the correct boundary for FormData
    body: formData,
  });
  return handleResponse(res);
}