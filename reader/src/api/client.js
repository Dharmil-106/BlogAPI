// ─── API Client Stubs ───
// This file is YOUR integration layer. Replace the mock implementations
// with real fetch calls to the Express API. Components import from here
// and never make API calls directly.

const API_BASE = '/api';  // TODO: set your actual API base URL

// ─── Mock Data ───
// Shaped to match the Prisma schema so the UI renders correctly.

const MOCK_POSTS = [
  {
    id: 'clx9a3f2c1qw0',
    title: 'Building JWT auth from scratch',
    content: `<p>Authentication is one of those things every developer needs to understand deeply. In this post, we'll build a complete JWT authentication system from the ground up using Node.js and Express.</p>
<h2>Why JWT?</h2>
<p>JSON Web Tokens provide a stateless authentication mechanism. Unlike session-based auth, JWTs don't require server-side storage, making them ideal for distributed systems and microservices architectures.</p>
<h2>The Implementation</h2>
<p>We start by setting up our Express server with the necessary middleware. The key packages we need are <code>jsonwebtoken</code> for token generation and verification, and <code>bcrypt</code> for password hashing.</p>
<pre><code>import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};</code></pre>
<p>The token contains the user's ID as payload and expires after 7 days. In production, you'd want to implement refresh tokens for a smoother user experience.</p>
<h2>Middleware</h2>
<p>Our auth middleware intercepts requests, extracts the token from the Authorization header, verifies it, and attaches the decoded user to the request object. This pattern keeps our route handlers clean and focused on business logic.</p>
<p>The beauty of this approach is its simplicity. Each request is self-contained — the server doesn't need to look up session data, and horizontal scaling becomes trivial.</p>`,
    bannerImg: null,
    published: true,
    authorId: 'user1',
    author: { id: 'user1', name: 'Dharmil', pfp: null },
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z',
  },
  {
    id: 'clx9d1e4brt20',
    title: 'Why I chose Prisma over raw SQL',
    content: `<p>Every backend developer faces this choice: write raw SQL, use a query builder, or go with a full ORM. After years of trying different approaches, I've settled on Prisma — and here's why.</p>
<h2>The Problem with Raw SQL</h2>
<p>Don't get me wrong — SQL is beautiful. But maintaining raw queries in a growing codebase becomes painful. String interpolation bugs, missing type safety, and the constant context-switching between SQL and JavaScript.</p>
<h2>Enter Prisma</h2>
<p>Prisma takes a schema-first approach. You define your data model in a <code>.prisma</code> file, and the client is generated with full TypeScript types. This means your editor catches errors before they hit production.</p>
<pre><code>model Post {
  id        String  @id @default(cuid())
  title     String
  content   String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String
}</code></pre>
<p>The generated client gives you methods like <code>prisma.post.findMany()</code> with full autocomplete and type checking. Relations are handled elegantly with <code>include</code> and <code>select</code>.</p>
<h2>Migrations</h2>
<p>Prisma Migrate generates SQL migrations from your schema changes. It tracks migration history and ensures your database schema stays in sync across environments. No more manual ALTER TABLE statements.</p>`,
    bannerImg: null,
    published: true,
    authorId: 'user1',
    author: { id: 'user1', name: 'Dharmil', pfp: null },
    createdAt: '2026-07-28T14:30:00Z',
    updatedAt: '2026-07-28T14:30:00Z',
  },
  {
    id: 'clx7b2k8mno30',
    title: 'Structuring Express apps that scale',
    content: `<p>Most Express tutorials show you a single <code>index.js</code> with all your routes. That works for a todo app, but falls apart the moment you need to add auth, validation, error handling, and tests.</p>
<h2>The Architecture</h2>
<p>I use a layered architecture: routes → controllers → services → data access. Each layer has a single responsibility, and dependencies flow in one direction.</p>
<p>Routes define the HTTP interface. Controllers handle request/response parsing. Services contain business logic. The data layer talks to the database.</p>
<h2>Why This Works</h2>
<p>Testing becomes straightforward — you can unit test services without spinning up an HTTP server. Swapping databases means changing one layer. Adding new features follows a predictable pattern.</p>`,
    bannerImg: null,
    published: true,
    authorId: 'user1',
    author: { id: 'user1', name: 'Dharmil', pfp: null },
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 'clx5e4r9xyz40',
    title: 'Google OAuth in 100 lines of code',
    content: `<p>Adding Google sign-in to your app doesn't need a passport.js dependency tree. Here's how to implement it with just the Google OAuth2 API and a few helper functions.</p>
<h2>The Flow</h2>
<p>OAuth2 follows a simple redirect flow: your app redirects to Google, the user consents, Google redirects back with a code, and you exchange that code for user info.</p>
<p>The entire server-side implementation fits in about 100 lines. No magic, no abstraction layers — just HTTP requests and JWT tokens.</p>`,
    bannerImg: null,
    published: true,
    authorId: 'user1',
    author: { id: 'user1', name: 'Dharmil', pfp: null },
    createdAt: '2026-07-02T16:45:00Z',
    updatedAt: '2026-07-02T16:45:00Z',
  },
];

const MOCK_COMMENTS = [
  {
    id: 'cmt1',
    content: 'Great breakdown! The middleware pattern you described is exactly what I use in production.',
    createdAt: '2026-08-13T08:00:00Z',
    updatedAt: '2026-08-13T08:00:00Z',
    postId: 'clx9a3f2c1qw0',
    authorId: 'user2',
    author: { id: 'user2', name: 'Alex Chen', pfp: null },
  },
  {
    id: 'cmt2',
    content: 'Have you considered using refresh tokens with short-lived access tokens? Curious how you handle token revocation.',
    createdAt: '2026-08-14T12:30:00Z',
    updatedAt: '2026-08-14T12:30:00Z',
    postId: 'clx9a3f2c1qw0',
    authorId: 'user3',
    author: { id: 'user3', name: 'Priya Sharma', pfp: null },
  },
];

// ─── Posts ───

/** Fetch all published posts */
export async function fetchPosts() {
  // TODO: implement — GET ${API_BASE}/posts
  return MOCK_POSTS;
}

/** Fetch a single post by ID */
export async function fetchPost(id) {
  // TODO: implement — GET ${API_BASE}/posts/${id}
  return MOCK_POSTS.find((p) => p.id === id) || null;
}

// ─── Comments ───

/** Fetch comments for a post */
export async function fetchComments(postId) {
  // TODO: implement — GET ${API_BASE}/comments/${postId}
  return MOCK_COMMENTS.filter((c) => c.postId === postId);
}

/** Create a comment on a post */
export async function createComment(postId, content) {
  // TODO: implement — POST ${API_BASE}/comments/${postId}
  console.log('createComment stub:', { postId, content });
}

/** Delete a comment */
export async function deleteComment(postId, commentId) {
  // TODO: implement — DELETE ${API_BASE}/comments/${postId}/${commentId}
  console.log('deleteComment stub:', { postId, commentId });
}

// ─── Auth ───

/** Initiate Google sign-in */
export async function googleSignIn() {
  // TODO: implement — POST ${API_BASE}/auth/google
  console.log('googleSignIn stub');
}

/** Sign out the current user */
export async function signOut() {
  // TODO: implement — clear token/session
  console.log('signOut stub');
}

/** Get the currently authenticated user, or null */
export function getCurrentUser() {
  // TODO: implement — decode JWT from localStorage, validate, return user
  return null;
}
