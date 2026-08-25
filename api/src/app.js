import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import authorRoutes from './routes/author.routes.js';

const app = express();

// Middlerwares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/auth', authRoutes);
app.use('/comments',commentsRoutes);
app.use('/posts', postsRoutes);
app.use('/author', authorRoutes);

export default app;