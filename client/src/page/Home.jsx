import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container, useDisclosure, FormHelperText} from '@chakra-ui/react';
import { Form, Link as RouterLink, useOutletContext, useNavigate} from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import { useState, useEffect} from 'react';

function Home() {
  const { user, setUser } = useOutletContext();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
  }

  useEffect(() => {
    pullBoards();
  }, []);

  async function pullBoards(){
    try {
      const response = await fetch('/api/boards', {
        method: 'GET',
    });
    if(response.ok){
      const jsonData = await response.json();
      setBoards(jsonData);
    }
  } catch (error) {
    console.error('Error fetching boards:', error)
    }
  }

  async function handleSubmit() {
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          creatorID: user,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        // navigate('/');
        window.location.reload();
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
      <h1>Boards</h1>
      <Container>
        <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
          {boards.map(board => (
            <Link key={board.id} as={RouterLink} to={`boards/${board.boardID}`} m={2} p={4} border="1px solid #ccc" borderRadius="md">
              {board.title}
            </Link>
          ))}
      </Flex>
      </Container>
      <Button maxW="150px" alignSelf="center" margin={'20px'} onClick={onOpen}>create board</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton/>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormControl>
                <FormLabel>Create Board</FormLabel>
                <Input type="title" onChange={e => {handleChangeValue(e, setTitle);}}/>
                <FormHelperText>Enter a title for your board</FormHelperText>
              </FormControl>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Home;
