import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container} from '@chakra-ui/react';
import { Link, useOutletContext} from 'react-router-dom';

function Board() {
    return (
      <Flex direction={'column'} justifyContent="center" alignItems="center" height="60vh">
        <h1>Board Title</h1>
        <Form>
        <FormControl>
          <FormLabel>Chat</FormLabel>
          <Input type="comment"/>
          <Button maxW="150px" alignSelf="center" type="submit" margin={'20px'} onClick={handleSubmit}>Chat</Button>
        </FormControl>
      </Form>
      </Flex>
    );
  }
  
  export default Board;