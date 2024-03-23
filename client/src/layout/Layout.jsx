import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Spacer,
} from '@chakra-ui/react';

export default function Layout() {
  const [user, setUser] = useState(null);

  async function login(username, password) {
    if (user) return;
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${username}:${password}`) },
      });
      const json = await response.json();

      if (response.ok) {
        setUser(json.username);
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
  return (
    <div className="layout">
      <Flex margin="20px">
        <Text fontSize="xl">Jesse Fan Club's web project</Text>
        <Spacer />
        {user ? <PrivateNavigation /> : <PublicNavigation />}
      </Flex>
      <main>
        <Outlet context={value} />
      </main>
    </div>
  );
}

function PublicNavigation() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="register">
          Register
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="login">
          Login
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
function PrivateNavigation() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="settings">
          Settings
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
