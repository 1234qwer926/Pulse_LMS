// UserMapping.jsx (Updated for centering the title and button)
import {
  Anchor,
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
import classes from '../AuthenticationForm/AuthenticationForm.module.css'; // Reuse the same CSS module for similar styling

export function UserMapping(props) {
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

  return (
    <Paper
      className={classes.formPaper} // Reuse class for centering and responsive styles
      radius="md"
      p="lg"
      withBorder
      {...props}
      style={{ maxWidth: '400px', margin: '0 auto' }} // Default centering
    >
      <Text size="lg" fw={500} ta="center"> {/* Added ta="center" for centering the title */}
        Map User to Group
      </Text>

      <Divider label="Enter user details" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit((values) => console.log('Mapping user:', values))}> {/* Handle submission as needed */}
        <Stack>
          <TextInput
            required
            label="User Email"
            placeholder="user@example.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <Select
            required
            label="Select Group"
            placeholder="Choose a group"
            data={['BL', 'BE', 'BM']}
            value={form.values.group}
            onChange={(value) => form.setFieldValue('group', value)}
            error={form.errors.group && 'Please select a group'}
            radius="md"
          />
        </Stack>

        <Group justify="center" mt="xl"> {/* Changed justify to "center" for centering the button */}
          <Button type="submit" radius="xl">
            Map User to Group
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
