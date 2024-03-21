import { useState } from 'react';
import { createContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false);

  async function login(username, password) {
    if (user) return;
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${username}:${password}`) },
      });

      if (response.ok) {
        setUser(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function logout() {
    if (!user) return;
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function register(username, email, password) {
    if (user) return;
    try {
      console.log('we are here');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        setUser(true);
        console.log(user);
      }
    } catch (err) {
      console.error(err);
    }
  }
  const value = { login, logout, register, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
