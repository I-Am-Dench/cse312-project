import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Image,
} from '@chakra-ui/react';
import coolguy from '../assets/coolguy.jpg';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  return (
    <Flex justifyContent="space-evenly">
      <RegisterForm />
      <Image src={coolguy} padding={'40px'} />
    </Flex>
  );
}
function RegisterForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
  }
  async function handleSubmit() {
    if (password === confirm) {
      const [success, message] = await register(username, email, password);
      if (success) {
        console.log(success);
        navigate('/');
      } else {
      }
    }
  }

  return (
    <Flex direction={'column'} padding="20px" maxWidth="500px" flexGrow="1">
      <Flex flexGrow="1" direction="column" justifyContent="space-evenly">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            onChange={e => {
              handleChangeValue(e, setUsername);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            onChange={e => {
              handleChangeValue(e, setEmail);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleChangeValue(e, setPassword);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleChangeValue(e, setConfirm);
            }}
          />
        </FormControl>
      </Flex>

      <Button
        maxW="150px"
        alignSelf="center"
        margin={'20px'}
        onClick={handleSubmit}
      >
        Register
      </Button>
    </Flex>
  );
}
