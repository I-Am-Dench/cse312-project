import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setError] = useState('');

  const navigate = useNavigate();
  function handleInput(event, onSetInput) {
    onSetInput(event.target.value);
  }

  async function handleSubmit() {
    try {
      const response = await fetch('/api/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        const json = await response.json();
        setError(json.error);
      }
    } catch (err) {
      console.error(err);
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
        <FormControl isInvalid={errorMsg}>
          <FormErrorMessage>{errorMsg}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errorMsg}>
          <FormLabel>Old Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setOldPassword);
            }}
          />
        </FormControl>
        <FormControl isInvalid={errorMsg}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setNewPassword);
            }}
          />
        </FormControl>

        <FormControl isInvalid={errorMsg}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            onChange={e => {
              handleInput(e, setConfirmPassword);
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
        Change Password
      </Button>

      <Flex direction="column" justifyContent="space-evenly" width="350px">
        <FormControl
          action="/upload"
          method="post"
          enctype="multipart/form-data"
        >
          <FormLabel>Change profile picture</FormLabel>
          <Input type="file" name="file_upload" />
          <Button maxW="150px" marginTop={'20px'} type="submit">
            Submit
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}
