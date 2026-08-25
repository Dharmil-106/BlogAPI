import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();

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

            {user && (
              <>
                <span className="navbar__separator">·</span>
                <div className="navbar__avatar" id="nav-user-avatar" title={`Logged in as ${user.id}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
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
