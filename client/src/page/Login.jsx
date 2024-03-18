import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';

export default function Login() {
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
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
      </Flex>

      <Button maxW="150px" alignSelf="center" margin={'20px'}>
        Login
      </Button>
    </Flex>
  );
}
