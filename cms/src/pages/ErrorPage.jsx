import { Link, useRouteError } from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Router Error Caught:", error);

  return (
    <div className="container error-page">
      <div className="error-content animate-in">
        <h1 className="text-danger">Error</h1>
        <h2>Something went wrong</h2>
        <p className="text-muted">The application encountered an unexpected error.</p>
        <Link to="/" className="btn">Return to Dashboard</Link>
      </div>
    </div>
  );
}
