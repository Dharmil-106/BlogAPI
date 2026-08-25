import { useState, useEffect } from 'react';
import { getAuthorProfile } from '../api/client';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAuthorProfile()
      .then(data => {
        if (!cancelled) setProfile(data);
      })
      .catch(err => console.error(err));
    return () => { cancelled = true; };
  }, []);

  return (
    <footer className="footer" id="site-footer">
      <div className="footer__inner container">
        <span className="footer__copy">© {year} Dharmil</span>
        <div className="footer__links">
          {profile?.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              GitHub
            </a>
          )}
          {profile?.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
