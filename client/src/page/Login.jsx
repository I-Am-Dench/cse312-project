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
  const { login } = useOutletContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setValid] = useState(true);
  function handleInput(event, onSetInput) {
    onSetInput(event.target.value);
  }

  async function handleLogin() {
    const success = await login(email, password);
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
          <FormErrorMessage>Email/Password is invalid.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!isValid}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            onChange={e => {
              handleInput(e, setEmail);
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
