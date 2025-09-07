import React, { useState } from 'react';
import { Button, FileInput, TextInput, Box, Text, Group, Paper, Title } from '@mantine/core';
import { IconUpload, IconLink } from '@tabler/icons-react';
import GeminiChatModal from './GeminiChatModal';

function FileUploadComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileKey, setFileKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState('');

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setStatusMessage(`Uploading ${selectedFile.name}...`);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://18.60.40.186:8081/upload', {
        method: 'POST',
        body: formData,
      });

      const key = await response.text();

      if (response.ok) {
        setStatusMessage(`Upload successful! File key: ${key}`);
        setFileKey(key); // Store the returned key
      } else {
        throw new Error(`Upload failed: ${response.status} - ${key}`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateUrl = async () => {
    if (!fileKey) {
      setStatusMessage('Please upload a file or enter a key first.');
      return;
    }

    setStatusMessage(`Generating URL for key: ${fileKey}...`);
    try {
      const response = await fetch(`https://18.60.40.186:8081/generate-presigned-url/${fileKey}`);
      const url = await response.text();

      if (response.ok) {
        setPresignedUrl(url);
        setStatusMessage('URL generated successfully!');
      } else {
        throw new Error(`Failed to generate URL: ${response.status} - ${url}`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Paper shadow="md" p="xl" withBorder>
      <Box maw={600} mx="auto">
        <Title order={2} ta="center" mb="lg">S3 File URL Generator</Title>

        {/* Upload Section */}
        <Box mb="xl">
          <Title order={4} mb="sm">1. Upload a File</Title>
          <Group>
            <FileInput
              placeholder="Select a file (video, PDF, etc.)"
              value={selectedFile}
              onChange={setSelectedFile}
              style={{ flex: 1 }}
              clearable
            />
            <Button onClick={handleUpload} leftSection={<IconUpload size={14} />} loading={isUploading} disabled={!selectedFile}>
              Upload
            </Button>
          </Group>
        </Box>

        {/* Generate URL Section */}
        <Box>
          <Title order={4} mb="sm">2. Generate URL</Title>
          <Group>
            <TextInput
              placeholder="File key will appear here after upload"
              value={fileKey}
              onChange={(event) => setFileKey(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button onClick={handleGenerateUrl} leftSection={<IconLink size={14} />} disabled={!fileKey}>
              Get URL
            </Button>
          </Group>
        </Box>

        {/* Status and URL Display */}
        <Box mt="lg">
          {statusMessage && <Text c="dimmed" ta="center">{statusMessage}</Text>}
          {presignedUrl && (
            <Box mt="sm">
              <Text fw={500}>Shareable URL (valid for 10 minutes):</Text>
              <Text c="blue" component="a" href={presignedUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                {presignedUrl}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
      <GeminiChatModal />
    </Paper>
  );
}

export default FileUploadComponent;
