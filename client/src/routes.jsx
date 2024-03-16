import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import App from './page/home';
import Layout from './layout/Layout';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<App />}></Route>
    </Route>
  )
);

export default router;
