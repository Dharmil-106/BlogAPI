import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="container not-found-page">
      <div className="not-found-content animate-in">
        <h1 className="text-accent">404</h1>
        <h2>Page not found</h2>
        <p className="text-muted">The resource you requested could not be located.</p>
        <Link to="/" className="btn">Return to Dashboard</Link>
      </div>
    </div>
  );
}
