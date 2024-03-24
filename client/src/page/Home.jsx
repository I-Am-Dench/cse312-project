import { Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Flex justifyContent={'center'}>
      <Link as={RouterLink} to="/">
        Text
      </Link>
    </Flex>
  );
}

export default Home;
