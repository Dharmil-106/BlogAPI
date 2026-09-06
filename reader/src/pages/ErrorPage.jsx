import { Link, useRouteError } from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Router Error Caught:", error);

  return (
    <div className="container error-page">
      <div className="error-content animate-in">
        <h1 className="text-danger mono">ERR_FATAL</h1>
        <h2>Something went wrong</h2>
        <p className="text-muted">An unexpected error occurred while rendering this page.</p>
        <Link to="/" className="btn mono">&larr; Return to safety</Link>
      </div>
    </div>
  );
}
