import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import App from './App';
const router = createHashRouter(
  createRoutesFromElements(<Route path="/" element={<App />}></Route>)
);

export default router;
