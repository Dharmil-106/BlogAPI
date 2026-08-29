import './PrivacyPage.css';

export default function PrivacyPage() {
  return (
    <div className="privacy-page container" id="privacy-page">
      <h1 className="privacy-page__title">Privacy Policy</h1>
      
      <p className="privacy-page__date">
        Last updated: August 29, 2026
      </p>

      <p className="privacy-page__intro">
        This blog collects limited personal information solely to support commenting and account functionality.
      </p>

      <section className="privacy-page__section">
        <h2>What we collect</h2>
        <p>
          When you sign in with Google to leave a comment, we receive your name, email address, and profile picture from your Google account. If you create an account directly, we collect the name, email, and password you provide (your password is never stored in plain text).
        </p>
      </section>

      <section className="privacy-page__section">
        <h2>How we use it</h2>
        <p>
          This information is used only to display your name and profile picture alongside comments you post, and to let you manage or delete comments you've written. We do not use your data for marketing, analytics, or any purpose beyond operating this blog.
        </p>
      </section>

      <section className="privacy-page__section">
        <h2>What we don't do</h2>
        <p>
          We do not sell, rent, or share your personal information with third parties. We do not use your data for advertising.
        </p>
      </section>

      <section className="privacy-page__section">
        <h2>Data retention and deletion</h2>
        <p>
          If you delete your account, your personal identifying information is removed. Comments and posts you've written may remain visible but will no longer be attributed to you.
        </p>
      </section>

      <section className="privacy-page__section">
        <h2>Third-party services</h2>
        <p>
          This site uses Google Sign-In for authentication and Cloudinary for image hosting. These services operate under their own privacy policies. We don't share your personal data with them beyond what's required for sign-in to function.
        </p>
      </section>

      <section className="privacy-page__section">
        <h2>Contact</h2>
        <p>
          Questions about this policy or your data can be sent to
          <a href="mailto:dharmil.palival@gmail.com"> dharmil.palival@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
