// UserMapping.jsx (Updated to be used in a modal)
import { useState } from 'react';
import {
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

// No need to import classes if it's only for centering, as the modal handles it.

export function UserMapping({ onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      group: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      group: (val) => (val ? null : 'Please select a group'),
    },
  });

  // In UserMapping.jsx

const handleSubmit = async (values) => {
  setLoading(true);
  setError('');

  try {
    // --- CORRECTED URL ---
    // Change this from /api/mappings/map-user to /api/user-mappings
    const response = await fetch('http://18.60.40.186:8081/api/user-mappings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, groupName: values.group }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to map user.');
    }

    const result = await response.json();
    console.log('Successfully mapped user:', result);
    
    if (onSuccess) {
      onSuccess(result);
    }
    
  } catch (err) {
    setError(err.message);
    console.error('Submission error:', err);
  } finally {
    setLoading(false);
  }
};


  return (
    // Using Paper for structure within the modal, but without extra styling
    <Paper p="md" shadow="none">
      {/* The modal provides the main title, so this can be a subtitle or removed */}
      <Text size="lg" fw={500} ta="center" mb="lg">
        Enter User Details
      </Text>

      {error && <Text c="red" ta="center" pb="md">{error}</Text>}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="User Email"
            placeholder="user@example.com"
            {...form.getInputProps('email')}
            radius="md"
          />
          <Select
            required
            label="Select Group"
            placeholder="Choose a group"
            data={['BL', 'BE', 'BM']}
            {...form.getInputProps('group')}
            radius="md"
          />
        </Stack>
        <Group justify="flex-end" mt="xl">
          {onClose && <Button variant="default" onClick={onClose}>Cancel</Button>}
          <Button type="submit" radius="xl" loading={loading}>
            Map User to Group
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
