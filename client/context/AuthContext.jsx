import { useState } from 'react';
import { createContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(username, password) {
    if (user) return;
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${username}:${password}`) },
      });

      if (response.ok) {
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
    } catch (err) {
      console.error(err);
    }
  }

  async function register(username, email, password) {
    if (user) return [false, 'already logged in'];
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const json = await response.json();
      console.log(json.error);
      if (json.hasOwnProperty('username')) {
        setUser(json.username);
        return [true, json.username];
      }
      if (json.hasOwnProperty('error')) {
        return [false, json.error];
      }
    } catch (err) {
      console.error(err);
    }
    return [false, 'FAILED TO CONTACT SERVER...'];
  }
  const value = { login, logout, register, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
