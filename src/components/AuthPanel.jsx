import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const friendlyError = (error) => {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "That email is already registered — try signing in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled for this project yet (Firebase Console > Authentication > Sign-in method).";
    case "auth/network-request-failed":
      return "Network error — check your connection and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists for this email using a different sign-in method.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup — allow popups for this site and try again.";
    default:
      return `Something went wrong (${error?.code || "unknown error"}). Please try again.`;
  }
};

// These aren't real failures — the user just backed out of the popup.
const isDismissedPopup = (error) =>
  error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request";

const AuthPanel = () => {
  const { user, authLoading, isFirebaseConfigured, signUp, signIn, signInWithGoogle, logOut } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Auth error:", err);
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (!isDismissedPopup(err)) {
        console.error("Auth error:", err);
        setError(friendlyError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <h2 className="auth-welcome-heading">Welcome to the Ultimate Combat Tracker Tool for D&amp;D</h2>
      <p className="auth-welcome-subheading">Made with love, The Dungeons Not Dating Team</p>

      {!isFirebaseConfigured && (
        <p className="auth-unconfigured-text">Sign-in isn't set up yet — see README.md to connect Firebase.</p>
      )}

      {isFirebaseConfigured && !authLoading && user && (
        <div className="auth-panel-signed-in">
          <span className="auth-user-email">Signed in as {user.email}</span>
          <button type="button" className="btn-secondary" onClick={logOut}>
            Sign Out
          </button>
        </div>
      )}

      {isFirebaseConfigured && !authLoading && !user && (
        <form className="auth-panel-form" onSubmit={handleSubmit}>
          <div className="auth-panel-tabs">
            <button
              type="button"
              className={`auth-tab${mode === "signin" ? " active" : ""}`}
              onClick={() => { setMode("signin"); setError(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab${mode === "signup" ? " active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Create Account
            </button>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <button
            type="button"
            className="google-signin-btn"
            disabled={submitting}
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
      )}

      <p className="auth-note">
        Login is Not required for use, so please enjoy with or without an account. Please note
        certain features do require an account in order to save your Players data or custom
        monsters. Accounts are still free to all.
      </p>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
  </svg>
);

export default AuthPanel;
