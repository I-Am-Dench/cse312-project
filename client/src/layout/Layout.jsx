import { NavLink, Outlet } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Text,
  Flex,
  Spacer,
} from '@chakra-ui/react';

export default function Layout() {
  return (
    <div className="layout">
      <Flex margin="20px">
        <Text fontSize="xl">Jesse Fan Club's web project</Text>
        <Spacer />
        <Navigation />
      </Flex>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
function Navigation() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="#">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink as={NavLink} to="#">
          Register
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Login</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
