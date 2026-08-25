import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
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
          </div>
        </div>
      </nav>
      <div className="navbar-spacer" />
    </>
  );
}
