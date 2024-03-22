import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Image,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import coolguy from '../assets/coolguy.jpg';
import { useNavigate, useOutletContext } from 'react-router-dom';
export default function Register() {
  return (
    <Flex justifyContent="space-evenly">
      <RegisterForm />
      <Image src={coolguy} padding={'40px'} />
    </Flex>
  );
}
function RegisterForm() {
  const { register } = useOutletContext();
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
    if (password === confirm && password !== '') {
      const [success, message] = await register(username, email, password);
      if (success) {
        navigate('/');
      } else {
        setMsg(message);
      }
    } else {
      setMsg('password');
    }
  }
  function hasErrorMsg(value) {
    return msg !== '' && msg.toLowerCase().includes(value);
  }
  return (
    <Flex direction={'column'} padding="20px" maxWidth="500px" flexGrow="1">
      <Flex flexGrow="1" direction="column" justifyContent="space-evenly">
        <FormControl isInvalid={hasErrorMsg('username')}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            onChange={e => {
              handleChangeValue(e, setUsername);
            }}
          />
          {!hasErrorMsg('username') ? (
            <FormHelperText>Enter a username.</FormHelperText>
          ) : (
            <FormErrorMessage>Username is already taken.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={hasErrorMsg('email')}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            onChange={e => {
              handleChangeValue(e, setEmail);
            }}
          />
          {!hasErrorMsg('email') ? (
            <FormHelperText>Enter an email.</FormHelperText>
          ) : (
            <FormErrorMessage>Email has already been taken.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={hasErrorMsg('password')}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleChangeValue(e, setPassword);
            }}
          />
          {!hasErrorMsg('password') ? (
            <FormHelperText>
              Enter an password with a length of 8 needs numbers or special
              characters.
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              Incorrect password length or format.
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={hasErrorMsg('password')}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleChangeValue(e, setConfirm);
            }}
          />
          {!hasErrorMsg('password') ? (
            <FormHelperText>
              Enter an password with a length of 8 needs numbers or special
              characters.
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              Incorrect password length or format.
            </FormErrorMessage>
          )}
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
