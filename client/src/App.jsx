import { Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Home from './Components/Home.jsx';

function App() {
  return (
    <Flex justifyContent={'center'}>
      <Link as={RouterLink} to="/">
        Text
      </Link>
    </Flex>
  );
}

export default App;
