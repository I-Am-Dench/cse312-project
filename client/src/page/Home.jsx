import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container, useDisclosure, FormHelperText} from '@chakra-ui/react';
import { Form, Link as RouterLink, useOutletContext} from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import { useState } from 'react';

function Home() {
  const { createBoard, user } = useOutletContext();
  const [title, setTitle] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
  }

  async function handleSubmit() {
    if (title != ''){
      const success = await createBoard(title);
      if (success) {
        navigate('/');
      }
    }
  }
  async function handleSubmit() {
    if (password === confirm && password !== '') {
      const [success, message] = await register(username, email, password);
      if (success) {
        navigate('/');
      } else {
        setMsg(message);
      }
    } else {
      setMsg('password');
    }
  }

  return (
    <Flex direction={'column'} justifyContent="center" alignItems="center" height="60vh">
      <h1>Boards</h1>
      <Container>
        <Link as={RouterLink} to="/">Text</Link>
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
            <Button type="submit">Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Home;
