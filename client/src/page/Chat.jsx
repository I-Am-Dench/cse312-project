import { Avatar, Button, Divider, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

import socket from '../socket';
import { useOutletContext } from 'react-router-dom';

export default function Chat() {
  const [log, setLog] = useState([]);
  const { user } = useOutletContext();
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join', { room: 'global' });

    return () => {
      socket.emit('leave', { room: 'global' });
    };
  }, []);

  useEffect(() => {
    const onConnect = data => {
      console.log(data);
    };
    const onReciveMessage = data => {
      console.log(data);
      setLog([...log, data]);
    };
    const onStatus = data => {
      console.log(data);
    };
    const updateLog = data => {
      const payload = data.payload;
      setLog([...payload]);
    };
    socket.on('get_chat_log', updateLog);
    socket.on('con', onConnect);
    socket.on('status', onStatus);
    socket.on('receive_message', onReciveMessage);

    return () => {
      socket.off('get_chat_log', updateLog);
      socket.off('con', onConnect);
      socket.off('receive_message', onReciveMessage);
      socket.off('status', onStatus);
    };
  }, [log]);

  return (
    <Flex width={'100%'} flexDir={'column'}>
      {log.map(item => {
        console.log(item);
        return (
          <Message
            isUser={item.user == user}
            text={`${item.user}: ${item.message}`}
          />
        );
      })}
      <ChatTextArea />
    </Flex>
  );
}
function Message(props) {
  const { isUser, text } = props;
  return (
    <Flex w="100%" justify={isUser ? 'flex-end' : 'flex-start'}>
      <Avatar alignSelf={'center'} marginX={'10px'} />
      <Text
        bg={isUser ? 'blue.300' : 'gray.500'}
        color="white"
        marginY="4"
        padding="4"
        minW="100px"
        maxW="250px"
      >
        {text}
      </Text>
    </Flex>
  );
}

function ChatTextArea() {
  const inputRef = useRef(null);
  function handleSend() {
    console.log(inputRef.current.value);
    const _message = inputRef.current.value;
    inputRef.current.value = '';
    if (_message != '')
      socket.emit('send_message', { room: 'global', message: _message });
  }
  return (
    <Flex width={'100%'}>
      <Input
        placeholder="Enter your message"
        type="text"
        size="lg"
        ref={inputRef}
      />
      <Button
        colorScheme="blue"
        alignSelf={'center'}
        ml={'15px'}
        onClick={handleSend}
      >
        send
      </Button>
    </Flex>
  );
}
