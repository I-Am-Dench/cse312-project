import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react';

export default function Layout() {
  const [user, setUser] = useState(null);

  async function logout() {
    if (!user) return;
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function validate() {
    try {
      const response = await fetch('/auth/validate', {
        method: 'POST',
      });
      if (response.ok) {
        const json = await response.json();
        setUser(json.username);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }
  const value = { user, setUser };

  useEffect(() => {
    validate().then();
  }, []);
  return (
    <div className="layout">
      <Flex margin="20px" justifyContent={'space-between'}>
        <Text alignSelf={'center'} width="17%" fontSize="xl">
          Jesse Fan Club's web project
        </Text>
        <Flex width="83%" justifyContent="center">
          {user ? (
            <Text alignSelf={'center'} fontSize="xl" justifyItems={'center'}>
              {user}
            </Text>
          ) : (
            <></>
          )}
        </Flex>
        {user ? (
          <>
            <PrivateNavigation />
            <Button maxW="150px" margin={'20px'} onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <PublicNavigation />
        )}
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
    <Breadcrumb alignSelf={'center'}>
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
