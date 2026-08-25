import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="site-footer">
      <div className="footer__inner container">
        <span className="footer__copy">© {year} Dharmil</span>
        <div className="footer__links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
