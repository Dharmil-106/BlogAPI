import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import authorRoutes from './routes/author.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

// Middlerwares
const allowedOrigins = [
    process.env.READER_URL,
    process.env.CMS_URL,
    'http://localhost:5173',
    'http://localhost:5174',
];

app.use(helmet());

app.set('trust proxy', 1);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/auth', authRoutes);
app.use('/comments', commentsRoutes);
app.use('/posts', postsRoutes);
app.use('/author', authorRoutes);
app.use('/upload', uploadRoutes);

// Centralized error handler — must be registered after all routes
app.use(errorHandler);

export default app;