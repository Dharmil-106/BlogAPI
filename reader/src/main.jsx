import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import SinglePostPage from './pages/SinglePostPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'posts', element: <PostsPage /> },
      { path: 'posts/:id', element: <SinglePostPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>,
);
