import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';

export default function Setting() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleInput(event, onSetInput) {
    onSetInput(event.target.value);
  }

  return (
    <Flex
      direction={'column'}
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <Flex direction="column" justifyContent="space-evenly" width="350px">
        <FormControl>
          <FormLabel>Old Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setOldPassword);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setNewPassword);
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setConfirmPassword);
            }}
          />
        </FormControl>
      </Flex>

      <Button maxW="150px" alignSelf="center" margin={'20px'}>
        Login
      </Button>
    </Flex>
  );
}
