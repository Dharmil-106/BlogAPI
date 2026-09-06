const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return handleResponse(res);
}

export async function getPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  return handleResponse(res);
}

export async function getComments(postId) {
  const res = await fetch(`${API_BASE}/comments/${postId}`);
  return handleResponse(res);
}

export async function getAuthorProfile() {
  const res = await fetch(`${API_BASE}/author`);
  return handleResponse(res);
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
  return handleResponse(res);
}

export async function deleteComment(postId, id, token) {
  const res = await fetch(`${API_BASE}/comments/${postId}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  return handleResponse(res);
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}