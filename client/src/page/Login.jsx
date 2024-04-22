import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Login() {
  const { user, setUser } = useOutletContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setValid] = useState(true);
  function handleInput(event, onSetInput) {
    onSetInput(event.target.value);
  }

  async function login(username, password) {
    if (user) return false;
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${username}:${password}`) },
      });

      if (response.ok) {
        const json = await response.json();
        setUser(json.username);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  async function handleLogin() {
    const success = await login(username, password);
    if (!success) {
      setValid(false);
    }
  }
  return (
    <Flex
      direction={'column'}
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <Flex direction="column" justifyContent="space-evenly" width="350px">
        <FormControl isInvalid={!isValid}>
          <FormErrorMessage>Username/Password is invalid.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!isValid}>
          <FormLabel>username</FormLabel>
          <Input
            type="text"
            onChange={e => {
              handleInput(e, setUsername);
            }}
          />
        </FormControl>
        <FormControl isInvalid={!isValid}>
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
