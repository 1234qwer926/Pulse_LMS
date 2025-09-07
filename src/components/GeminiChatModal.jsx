import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  Textarea,
  Box,
  Text,
  Paper,
  Title,
  Loader,
  ScrollArea,
  ActionIcon
} from '@mantine/core';
import { IconMessageChatbot, IconSparkles, IconSend } from '@tabler/icons-react';

function GeminiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const viewport = useRef(null);

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  };

  // Automatically scroll down when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);


  const handleSendMessage = async () => {
    if (!prompt.trim()) {
      return;
    }

    const userMessage = { sender: 'user', text: prompt };
    // Add user message to history
    setChatHistory(prev => [...prev, userMessage]);
    setPrompt(''); // Clear input immediately
    setIsLoading(true);
    setError('');

    try {
      // API call to your corrected POST endpoint
      const response = await fetch('http://localhost:8081/api/gemini/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Sending the prompt as plain text
        },
        body: prompt,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      const botMessage = { sender: 'bot', text: responseText };
      // Add bot response to history
      setChatHistory(prev => [...prev, botMessage]);

    } catch (err) {
      setError(err.message);
      const errorMessage = { sender: 'bot', text: 'Sorry, I ran into an error. Please try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message, index) => (
    <Paper
      key={index}
      p="sm"
      radius="lg"
      withBorder
      mb="sm"
      style={{
        backgroundColor: message.sender === 'user' ? '#e7f5ff' : '#f8f9fa',
        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
      }}
    >
      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</Text>
    </Paper>
  );

  return (
    <>
      {/* The floating button to open the modal */}
      <ActionIcon
        variant="filled"
        color="blue"
        size="xl"
        radius="xl"
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        onClick={() => setIsOpen(true)}
      >
        <IconMessageChatbot size={24} />
      </ActionIcon>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={<Title order={4}>Chat with AI Assistant</Title>}
        size="lg"
      >
        <Box style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
          {/* Chat History Area */}
          <ScrollArea viewportRef={viewport} style={{ flex: 1, marginBottom: '1rem' }}>
            <Box style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
              {chatHistory.map(renderMessage)}
              {isLoading && <Loader size="sm" style={{ alignSelf: 'flex-start' }} />}
            </Box>
          </ScrollArea>

          {/* Input Area */}
          <Box>
            {error && <Text c="red" size="xs" mb="xs">{error}</Text>}
            <Textarea
              placeholder="Ask me anything..."
              value={prompt}
              onChange={(event) => setPrompt(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
              autosize
              minRows={2}
              rightSection={
                <ActionIcon onClick={handleSendMessage} loading={isLoading} size={32} radius="xl" variant="filled">
                  <IconSend size={18} />
                </ActionIcon>
              }
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default GeminiChatModal;
