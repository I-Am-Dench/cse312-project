import { Button, Flex, Link, FormControl, FormLabel, Input, FormErrorMessage, Container, useDisclosure, FormHelperText} from '@chakra-ui/react';
import { Form, Link as RouterLink, useOutletContext, useNavigate} from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import { useState } from 'react';

function Home() {
  const { user } = useOutletContext();
  const [title, setTitle] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  function handleChangeValue(event, onSetValue) {
    onSetValue(event.target.value);
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
        navigate('/');
      }
    } catch (err) {
      console.error(err);
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
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Home;
