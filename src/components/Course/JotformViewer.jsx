import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Button, Text, Title, Group, ScrollArea, Divider, Loader } from '@mantine/core';
import axios from 'axios';

// Helper function to safely parse content that might be a JSON string
const parseContent = (content) => {
    try {
        // For media elements, the content is a JSON string that needs to be parsed.
        return JSON.parse(content);
    } catch (e) {
        // If parsing fails, it's a regular string (like for a heading or paragraph).
        return content;
    }
};

// Updated element renderer to handle parsed content
function renderElement(element) {
  const style = {
    textAlign: element.align || 'left',
    marginBottom: '16px',
  };

  // Parse the content field to handle both string and JSON string data
  const content = parseContent(element.content);

  switch (element.tagName) {
    case 'heading':
      return <Title order={2} style={{ ...style, fontSize: element.size || 'xl' }}>{content}</Title>;
    
    case 'paragraph':
      return <Text style={style}>{content}</Text>;
    
    case 'image':
      // After parsing, content will be an object with a 'fileUrl' property
      const imageUrl = typeof content === 'object' ? content.fileUrl : content;
      return (
        <Box style={style}>
          <img src={imageUrl} alt={element.elementName} style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      );
      
    case 'video':
      const videoUrl = typeof content === 'object' ? content.fileUrl : content;
      return (
        <Box style={style}>
          <video controls src={videoUrl} style={{ maxWidth: '100%' }}>
            Your browser does not support the video tag.
          </video>
        </Box>
      );
      
    case 'audio':
      const audioUrl = typeof content === 'object' ? content.fileUrl : content;
      return (
        <Box style={style}>
          <audio controls src={audioUrl} style={{ width: '100%' }}>
            Your browser does not support the audio tag.
          </audio>
        </Box>
      );
      
    case 'orderedlist':
      const items = typeof content === 'string' ? content.split(', ') : [];
      return (
        <ol style={{ ...style, paddingLeft: 20 }}>
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ol>
      );
      
    case 'unorderedlist':
      const u_items = typeof content === 'string' ? content.split(', ') : [];
      return (
        <ul style={{ ...style, paddingLeft: 20 }}>
          {u_items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      );
      
    case 'horizontalline':
      return <Divider my="md" />;
      
    case 'breakline':
      return <br />;
      
    default:
      return null;
  }
}

// The rest of the JotformViewer component remains the same
export function JotformViewer({ jotformName, onBack }) {
  const [jotformContent, setJotformContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!jotformName) return;

    const fetchJotformContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8081/api/jotforms/name/${jotformName}`);
        setJotformContent(response.data);
      } catch (err) {
        setError('Failed to load learning material. Please try again.');
        console.error(`Error fetching jotform "${jotformName}":`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchJotformContent();
  }, [jotformName]);

  if (loading) {
    return <Container ta="center" py="xl"><Loader /></Container>;
  }

  if (error) {
    return (
        <Container size="md" py="xl">
            <Button onClick={onBack} variant="light" mb="md">&larr; Back to Courses</Button>
            <Text color="red" ta="center">{error}</Text>
        </Container>
    );
  }

  if (!jotformContent || !jotformContent.pages) {
    return (
        <Container size="md" py="xl">
            <Button onClick={onBack} variant="light" mb="md">&larr; Back to Courses</Button>
            <Text ta="center">No content available.</Text>
        </Container>
    );
  }

  const currentPageData = jotformContent.pages.find(p => p.page === currentPage + 1);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === jotformContent.totalPages - 1;

  return (
    <Container size="md" py="xl">
      <Button onClick={onBack} variant="light" mb="md">
        &larr; Back to Courses
      </Button>
      <Paper shadow="sm" p="xl" withBorder>
        <Title order={2} ta="center" mb="xl">{jotformContent.jotformName}</Title>
        <ScrollArea style={{ height: '60vh' }}>
          {currentPageData && currentPageData.elements.map(element => (
             <React.Fragment key={element.id || `${element.page.id}-${element.sequence}`}>
               {renderElement(element)}
             </React.Fragment>
          ))}
        </ScrollArea>
        <Group justify="center" mt="xl">
          {!isFirstPage && (
            <Button onClick={() => setCurrentPage(p => p - 1)} variant="outline">Back</Button>
          )}
          {!isLastPage && (
            <Button onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
}
