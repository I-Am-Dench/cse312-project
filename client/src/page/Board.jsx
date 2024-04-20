import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container, Box, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {Link as RouterLink, useOutletContext, Form, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';

function Board() {
  const { boardID } = useParams();
  const { user, setUser } = useOutletContext();
  const [board, setBoard] = useState([]);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
  }

  useEffect(() => {
    pullComments();
  }, []);

  async function deleteBoard() {
    try {
      const response = await fetch(`/api/boards/${boardID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_id: boardID,
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

  async function deleteComment(commentID) {
    try {
      const response = await fetch(`/api/boards/${boardID}/comments/${commentID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_id: board.boardID,
          comment: commentID,
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
  
  async function pullComments(){
    try {
      const response = await fetch(`/api/boards/${boardID}`, {
        method: 'GET',
    });
    if(response.ok){
      const jsonData = await response.json();
      setBoard(jsonData.board);
      setComments(jsonData.comments);
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
        <Button maxW="150px" alignSelf="center" type="submit" margin={'20px'} onClick={deleteBoard}>Delete Board</Button>
        {board && (
        <>
          <h1>{board.title}</h1>
          <p>Creator: {board.creatorID}</p>
        </>
      )}
      <br></br>

          <div id="chat-messages">
            {comments.map(comment => (
              <div key={comment.id}>
                <Button onClick={() => deleteComment(comment.id)} style={{ marginRight: '5px' }}>Delete</Button>
                <b>{comment.CreatorId}</b>: {comment.Content}<br/>
              </div>
            ))}
          </div>

        <Form>
          <FormControl>
            <FormLabel>Chat</FormLabel>
            <Input type="content" onChange={e => {handleChangeValue(e, setContent);}} />
            <Button maxW="150px" alignSelf="center" type="submit" margin={'20px'} onClick={handleSubmit}>Send</Button>
          </FormControl>
      </Form>
      </Flex>
    );
  }
  
  export default Board;