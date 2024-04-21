import {
  Button,
  Flex,
  Link,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Container,
  Box,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Link as RouterLink,
  useOutletContext,
  Form,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import coolguy from '../assets/coolguy.jpg';

function Board() {
  const { boardID } = useParams();
  const { user, setUser } = useOutletContext();
  const [board, setBoard] = useState([]);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const formData = new FormData();

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
        // const json = await response.json();
        navigate('/');
        // window.location.href = "/"
      } else {
        const json = await response.json();
        if (json.auth_error) {
          setUser(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteComment(commentID) {
    try {
      const response = await fetch(
        `/api/boards/${boardID}/comments/${commentID}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            board_id: board.boardID,
            comment: commentID,
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        window.location.reload();
      } else {
        const json = await response.json();
        if (json.auth_error) {
          setUser(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function pullComments() {
    try {
      const response = await fetch(`/api/boards/${boardID}`, {
        method: 'GET',
      });
      if (response.ok) {
        const jsonData = await response.json();
        setBoard(jsonData.board);
        setComments(jsonData.comments);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
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
        // navigate('/');
        window.location.reload();
      } else {
        const json = await response.json();
        if (json.auth_error) {
          setUser(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  function onImageChange(event) {
    if (event.target && event.target.files[0]) {
      formData.append('image_upload', event.target.files[0]);
    }
  }
  async function handleImageSubmit() {
    try {
      const response = await fetch(`/api/boards/${boardID}/media`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
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
      <Button
        maxW="150px"
        alignSelf="center"
        type="submit"
        margin={'20px'}
        onClick={deleteBoard}
      >
        Delete Board
      </Button>
      {board && (
        <>
          <h1>{board.title}</h1>
          <p>Creator: {board.creatorID}</p>
        </>
      )}
      <br></br>

      <div
  id="chat-messages"
  style={{
    maxHeight: '90vh',
    maxWidth: '90vw',
    height: '90vh',
    width: '60vw',
    overflow: 'auto',
  }}
>
  {comments.map(comment => (
    <div key={comment.id}>
      {comment.imageUrl ? (
        <div>
          <Button
        onClick={() => deleteComment(comment.id)}
        style={{ marginRight: '5px' }}
      >
        Delete
      </Button>
          <b style={{ marginRight: '5px' }}>{comment.CreatorId}</b>: <Image src={comment.imageUrl} boxSize='100px' objectFit='cover' style={{ marginLeft: '5px', marginTop: '5px' }}/>
        </div>
      ) : (
        <div>
          <Button
        onClick={() => deleteComment(comment.id)}
        style={{ marginRight: '5px' }}
      >
        Delete
      </Button>
          <b>{comment.CreatorId}</b>: {comment.Content}
        </div>
      )}
      <br />
    </div>
  ))}
  <br></br>
  <br></br>
</div>

      <Form>
        <FormControl style={{ display: 'flex' }}>
          <FormLabel>Chat</FormLabel>
          <Input
            type="content"
            marginTop={'20px'}
            onChange={e => {
              handleChangeValue(e, setContent);
            }}
          />
          <Button
            maxW="150px"
            alignSelf="center"
            type="submit"
            margin={'20px'}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </FormControl>
        <FormControl style={{ display: 'flex' }}>
          <FormLabel>Add Image</FormLabel>
          <Input type="file" name="image_upload" onChange={onImageChange} marginTop={'20px'} />
          <Button maxW="150px" marginTop={'20px'} onClick={handleImageSubmit}>
            Submit
          </Button>
        </FormControl>
      </Form>
    </Flex>
  );
}

export default Board;
