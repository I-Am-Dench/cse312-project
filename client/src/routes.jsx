import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Home from './page/Home';
import Register from './page/Register';
import Layout from './layout/Layout';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />}></Route>
      <Route path="register" element={<Register />}></Route>
    </Route>
  )
);

export default router;
