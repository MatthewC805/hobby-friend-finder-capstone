import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  syncMatchesShape,
  updateProfile
} from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    syncMatchesShape();
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      isLoggedIn: Boolean(currentUser),
      hasProfile: Boolean(currentUser?.username),
      register: (formData) => {
        const result = registerAccount(formData);
        if (result.ok) {
          setCurrentUser(result.account);
        }
        return result;
      },
      login: (email, password) => {
        const result = loginAccount(email, password);
        if (result.ok) {
          setCurrentUser(result.account);
        }
        return result;
      },
      logout: () => {
        logoutAccount();
        setCurrentUser(null);
      },
      saveProfile: (profileData) => {
        const result = updateProfile(profileData);
        if (result.ok) {
          setCurrentUser(result.account);
        }
        return result;
      },
      refreshUser: () => setCurrentUser(getCurrentUser())
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
