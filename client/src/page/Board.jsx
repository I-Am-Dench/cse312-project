import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container} from '@chakra-ui/react';
import { Link, useOutletContext} from 'react-router-dom';

function Board() {
  const { user } = useOutletContext();
  
  async function handleSubmit() {
    try {
      const response = await fetch('/api/boards/<board_id>/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          creatorID: user,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

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