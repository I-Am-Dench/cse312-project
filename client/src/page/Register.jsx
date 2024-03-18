import React from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Image,
} from '@chakra-ui/react';
import coolguy from '../assets/coolguy.jpg';
export default function Register() {
  return (
    <Flex justifyContent="space-evenly">
      <RegisterForm />
      <Image src={coolguy} padding={'40px'} />
    </Flex>
  );
}
function RegisterForm() {
  return (
    <Flex direction={'column'} padding="20px" maxWidth="500px" flexGrow="1">
      <Flex flexGrow="1" direction="column" justifyContent="space-evenly">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" />
        </FormControl>
      </Flex>

      <Button maxW="150px" alignSelf="center" margin={'20px'}>
        Register
      </Button>
    </Flex>
  );
}
