import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { getInitial } from '../utils/avatar';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();
  const [theme, setTheme] = useTheme();

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="navbar__inner container">
          <Link to="/" className="navbar__brand">
            dharmil<span>.</span>blog
          </Link>

          <div className="navbar__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Home
            </NavLink>
            <span className="navbar__separator">·</span>
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Posts
            </NavLink>
            <span className="navbar__separator">·</span>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              About
            </NavLink>

            <span className="navbar__separator">·</span>

            <button
              className="navbar__theme-toggle"
              onClick={toggleTheme}
              type="button"
              id="theme-toggle-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                /* Moon icon */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {user && (
              <>
                <span className="navbar__separator">·</span>
                <div className="navbar__avatar" id="nav-user-avatar" title={user.name || undefined}>
                  {user.pfp ? (
                    <img src={user.pfp} alt={user.name} />
                  ) : user.name ? (
                    getInitial(user.name)
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="navbar-spacer" />
    </>
  );
}
