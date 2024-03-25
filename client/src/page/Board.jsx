import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container} from '@chakra-ui/react';
import {Link as RouterLink, useOutletContext, Form, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';

function Board() {
  const { boardID } = useParams();
  const { user, setUser } = useOutletContext();
  const [board, setBoard] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
  }

  useEffect(() => {
    pullComments();
  }, []);
  
  async function pullComments(){
    try {
      const response = await fetch(`/api/boards/${boardID}`, {
        method: 'GET',
    });
    if(response.ok){
      const jsonData = await response.json();
      setBoard(jsonData);
    }
  } catch (error) {
    console.error('Error fetching boards:', error)
    }
  }

  async function handleSubmit() {
    try {
      const response = await fetch(`/api/boards/${boardID}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user,
          content: content,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        navigate('/');
      } else {
        const json = await response.json()
        if(json.auth_error) {
          setUser(null)
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

    return (
      <Flex direction={'column'} justifyContent="center" alignItems="center" height="60vh">
        <h1>Board Title</h1>
        <Container>
          {board.map((board, index) => (
            <p key={index}>{board.comments}</p>
          ))}
        </Container>
        <Form>
          <FormControl>
            <FormLabel>Chat</FormLabel>
            <Input type="content" onChange={e => {handleChangeValue(e, setContent);}} />
            <Button maxW="150px" alignSelf="center" type="submit" margin={'20px'} onClick={handleSubmit}>Chat</Button>
          </FormControl>
      </Form>
      </Flex>
    );
  }
  
  export default Board;