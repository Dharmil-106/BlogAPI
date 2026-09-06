import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="container not-found-page">
      <div className="not-found-content animate-in">
        <h1 className="mono text-accent">404</h1>
        <h2 className="mono">fatal: pathspec not found</h2>
        <p className="text-muted">The branch or commit you are looking for does not exist in this repository.</p>
        <Link to="/" className="btn mono">&larr; git checkout main</Link>
      </div>
    </div>
  );
}
