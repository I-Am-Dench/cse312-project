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
    } catch (err) {
      console.error(err);
    }
  }

  async function register(username, email, password) {
    if (user) return;
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
      if (json.hasOwnProperty('username')) {
        setUser(true);
        return true, json.username;
      } 
      if(json.hasOwnProperty('error')){
        return false, json.error
      }
    } catch (err) {
      console.error(err);
    }
    return false, 'FAILED TO CONTACT SERVER...';
  }
  const value = { login, logout, register, user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
