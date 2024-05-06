import { Avatar, Button, Flex, Input, Text } from '@chakra-ui/react';
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
    }, 600000); // Refresh every 10 minutes

    return () => {
      socket.emit('leave', { room: 'global' });
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    socket.on('get_chat_log', updateLog => {
      setLog(updateLog.payload);
    });
    socket.on('receive_message', message => {
      setLog(prevLog => [...prevLog, message]);
    });

    return () => {
      socket.off('get_chat_log');
      socket.off('receive_message');
    };
  }, []);

  return (
    <Flex width={'100%'} flexDir={'column'}>
      {/* notification */}
      <Text textAlign="center" p={2} color="gray.600">
        All messages are removed every 10 minutes.
      </Text>
      {log.map((item, index) => (
        <Message
          key={index}  // Use unique id if available
          isUser={item.user === user}
          text={`${item.user}: ${item.message}`}
          avatar={item.avatar}
        />
      ))}
      <ChatTextArea />
    </Flex>
  );
}

function Message({ isUser, text, avatar }) {
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
