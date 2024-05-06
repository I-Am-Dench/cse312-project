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

    const refreshInterval = setInterval(() => {
      socket.emit('refresh_log', { room: 'global' });
    }, 600000); // Refresh every 10 seconds

    return () => {
      socket.emit('leave', { room: 'global' });
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    const onConnect = data => {
      console.log(data);
    };
    const onReciveMessage = data => {
      console.log(data);
      setLog(prevLog => [...prevLog, data]);
    };
    const onStatus = data => {
      console.log(data);
    };
    const updateLog = data => {
      const payload = data.payload;
      setLog(payload);
    };
    const handleErr = err => {
      console.log(err.message);
      console.log(err.description);
      console.log(err.context);
    };

    socket.on('get_chat_log', updateLog);
    socket.on('con', onConnect);
    socket.on('status', onStatus);
    socket.on('receive_message', onReciveMessage);
    socket.on('connect_error', handleErr);

    return () => {
      socket.off('get_chat_log', updateLog);
      socket.off('con', onConnect);
      socket.off('receive_message', onReciveMessage);
      socket.off('status', onStatus);
      socket.off('connect_error', handleErr);
    };
  }, []);

  return (
    <Flex width={'100%'} flexDir={'column'}>
      {log.map(item => (
        <Message
          key={item.id}
          isUser={item.user === user}
          text={`${item.user}: ${item.message}`}
          avatar={item.avatar}
        />
      ))}
      <ChatTextArea />
    </Flex>
  );
}

function Message(props) {
  const { isUser, text, avatar } = props;
  return (
    <Flex w="100%" justify={isUser ? 'flex-end' : 'flex-start'}>
      <Avatar src={avatar} alignSelf={'center'} marginX={'10px'} />
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
    const message = inputRef.current.value.trim();
    if (message !== '') {
      socket.emit('send_message', { room: 'global', message });
      inputRef.current.value = '';
    }
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
        Send
      </Button>
    </Flex>
  );
}
