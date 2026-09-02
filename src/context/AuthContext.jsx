import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase/config";

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const requireConfigured = () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase isn't configured yet — see README.md for setup.");
    }
  };

  const signUp = (email, password) => {
    requireConfigured();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    requireConfigured();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    requireConfigured();
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    requireConfigured();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, isFirebaseConfigured, signUp, signIn, signInWithGoogle, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
