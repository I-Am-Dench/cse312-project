import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Login() {
  const { login } = useOutletContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleInput(event, onSetInput) {
    onSetInput(event.target.value);
  }

  function handleLogin() {
    login(email, password);
    
  }
  return (
    <Flex
      direction={'column'}
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <Flex direction="column" justifyContent="space-evenly" width="350px">
        <FormControl margin="auto">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            onChange={e => {
              handleInput(e, setEmail);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setPassword);
            }}
          />
        </FormControl>
      </Flex>

      <Button
        maxW="150px"
        alignSelf="center"
        margin={'20px'}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Flex>
  );
}
