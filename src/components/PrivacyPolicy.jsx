const LAST_UPDATED = "September 2, 2026";

const PrivacyPolicy = () => (
  <div className="privacy-policy">
    <a href="/" className="back-link">← Back to the Combat Tracker</a>

    <h1>Privacy Policy</h1>
    <p className="privacy-updated">Last updated: {LAST_UPDATED}</p>

    <p>
      This Combat Tracker is provided by the Dungeons Not Dating team. This
      policy explains what information the app collects, how it's used, and
      the choices you have.
    </p>

    <h2>What we collect</h2>
    <p>
      You can use the core tracker — adding combatants, tracking HP and
      initiative — without ever creating an account, and none of that
      encounter data leaves your browser; it's stored locally on your device
      only.
    </p>
    <p>Creating an account is optional and only needed to save a personal library of characters and monsters. If you sign in, we collect:</p>
    <ul>
      <li>
        <strong>Account info</strong> — your email address if you sign up
        with email/password, or your name, email address, and profile
        picture if you sign in with Google. This is handled by Firebase
        Authentication (a Google service).
      </li>
      <li>
        <strong>Saved characters and custom monsters</strong> — the name,
        max HP, AC, and (for monsters) challenge rating you choose to save to
        your library, stored in Firestore (also a Google service) under your
        account.
      </li>
    </ul>

    <h2>How we use it</h2>
    <p>
      Account info is used solely to identify your account and keep your
      saved characters and monsters private to you. We don't use analytics,
      advertising trackers, or sell any data to third parties.
    </p>

    <h2>Who can see your data</h2>
    <p>
      Your saved characters and custom monsters are private — our security
      rules only allow your own signed-in account to read or write them.
      Nobody else using the app can see your library.
    </p>

    <h2>Third-party services</h2>
    <p>
      Authentication and data storage are handled by Google Firebase, which
      processes data on our behalf under its own privacy and security
      terms. We don't share your information with any other third party.
    </p>

    <h2>Your choices</h2>
    <p>
      You can delete individual saved characters or monsters at any time
      from within the app. To delete your entire account and all associated
      data, contact us at{" "}
      <a href="mailto:hello@dungeonsnotdating.com">hello@dungeonsnotdating.com</a>.
    </p>

    <h2>Children's privacy</h2>
    <p>
      This app is not directed at children under 13, and we don't knowingly
      collect information from children under 13.
    </p>

    <h2>Changes to this policy</h2>
    <p>
      If this policy changes, we'll update the "Last updated" date above.
      Continued use of the app after a change means you accept the updated
      policy.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about this policy? Email us at{" "}
      <a href="mailto:hello@dungeonsnotdating.com">hello@dungeonsnotdating.com</a>.
    </p>
  </div>
);

export default PrivacyPolicy;
