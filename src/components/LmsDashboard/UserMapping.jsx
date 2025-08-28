// UserMapping.jsx (Updated with API call to port 8081)
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
import classes from '../AuthenticationForm/AuthenticationForm.module.css';

export function UserMapping(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // *** THE ONLY CHANGE IS HERE: Updated port to 8081 ***
      const response = await fetch('http://localhost:8081/api/mappings/map-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email, groupName: values.group }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to map user. Please try again.');
      }

      const result = await response.json();
      console.log('Successfully mapped user:', result);
      setSuccess(`User ${result.email} successfully mapped to group ${result.groupName}!`);
      form.reset();
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      className={classes.formPaper}
      radius="md"
      p="lg"
      withBorder
      {...props}
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <Text size="lg" fw={500} ta="center">
        Map User to Group
      </Text>

      <Divider label="Enter user details" labelPosition="center" my="lg" />

      {success && <Text c="teal" ta="center" pb="md">{success}</Text>}
      {error && <Text c="red" ta="center" pb="md">{error}</Text>}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="User Email"
            placeholder="user@example.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
            radius="md"
          />
          <Select
            required
            label="Select Group"
            placeholder="Choose a group"
            data={['BL', 'BE', 'BM']}
            value={form.values.group}
            onChange={(value) => form.setFieldValue('group', value)}
            error={form.errors.group}
            radius="md"
          />
        </Stack>
        <Group justify="center" mt="xl">
          <Button type="submit" radius="xl" loading={loading}>
            Map User to Group
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
