import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="layout">
      <div className="nav">
        <NavLink to="/"> Home </NavLink>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
