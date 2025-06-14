import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

const TermsPage = () => (
  <div
    className='inner-container flex flex-col items-start justify-start gap-4 text-left'
    data-role='terms-page'
  >
    <title>{`Terms, conditions, and privacy policy – ${siteMeta.siteName}`}</title>
    <NotificationBar />
    <h1>Terms and Conditions, Privacy Policy</h1>
    <p>
      <strong>Last updated:</strong> April 30, 2025
    </p>

    <h2>Terms and Conditions</h2>

    <p>
      By accessing and using this website (the "Site"), you agree to be bound by the following
      terms. If you do not agree, please do not use the Site.
    </p>

    <h3>1. User Accounts</h3>
    <ul>
      <li>You may register using OAuth (e.g., Google, GitHub) or username.</li>
      <li>If you register via OAuth, we only store your ID and avatar — not your email address.</li>
      <li>
        When registering or logging in, we generate and store your device fingerprint solely for
        security purposes.
      </li>
      <li>
        You may delete your account at any time. Please note: deleting your account does not
        automatically delete content you have posted.
      </li>
    </ul>

    <h3>2. Content Ownership</h3>
    <ul>
      <li>You retain ownership of the content you post (e.g., articles, comments).</li>
      <li>You may modify or delete your content at any time.</li>
      <li>
        If you wish your content to be removed after account deletion, please delete it first.
      </li>
    </ul>

    <h3>3. Site Availability</h3>
    <p>
      The Site may be unavailable at times due to maintenance or technical issues. We are not
      responsible for data loss or service interruptions.
    </p>

    <h3>4. Changes to Terms</h3>
    <p>
      We may update these Terms at any time. Continued use of the Site after changes implies your
      acceptance of the updated Terms.
    </p>

    <h2>Privacy Policy</h2>

    <p>
      This policy explains how we collect, use, and protect your personal data in compliance with
      the General Data Protection Regulation (GDPR).
    </p>

    <h3>1. What We Collect</h3>
    <ul>
      <li>
        <strong>OAuth Login:</strong> We store only your OAuth ID and avatar. We do <em>not</em>{' '}
        store your email.
      </li>
      <li>
        <strong>Account Login/Register:</strong> We store your device fingerprint for security
        purposes only.
      </li>
      <li>
        <strong>Contact Form:</strong> If you contact us, we collect your email address solely to
        reply to your message.
      </li>
      <li>
        <strong>Analytics:</strong> We collect anonymous usage statistics without using cookies or
        tracking your personal activity.
      </li>
    </ul>

    <h3>2. Your Rights</h3>
    <ul>
      <li>You may delete your account at any time.</li>
      <li>Content you post remains on the site unless you remove it before account deletion.</li>
      <li>
        You have the right to access, correct, or delete your personal data. Please contact us for
        requests.
      </li>
    </ul>

    <h3>3. Data Protection</h3>
    <p>
      We use appropriate technical and organizational measures to secure your data. We never sell
      your data to third parties.
    </p>

    <h3>4. Contact</h3>
    <p>
      If you have questions about this policy or how your data is handled, please contact us via
      email.
    </p>

    <h3>5. Consent</h3>
    <p>
      By using this website, you consent to the terms described in this Privacy Policy and the Terms
      and Conditions. No cookies or tracking tools requiring consent are used.
    </p>
  </div>
);

export default TermsPage;
