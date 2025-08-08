// CreateJotform.jsx
import {
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import classes from '../AuthenticationForm/AuthenticationForm.module.css'; // Reuse the same CSS module for similar styling (adjust path if needed)

export function CreateJotform(props) {
  const form = useForm({
    initialValues: {
      jotformName: '',
    },

    validate: {
      jotformName: (val) => (val.length > 0 ? null : 'Please enter a Jotform name'),
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
        
      <Text size="lg" fw={500} ta="center"> {/* Centered title */}
        Create Jotform
      </Text>
        
      <Divider label="Enter Jotform details" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit((values) => console.log('Creating Jotform:', values))}> {/* Handle submission as needed */}
        <Stack>
          <TextInput
            required
            label="Jotform Name"
            placeholder="Enter form name"
            value={form.values.jotformName}
            onChange={(event) => form.setFieldValue('jotformName', event.currentTarget.value)}
            error={form.errors.jotformName && 'Please enter a Jotform name'}
            radius="md"
          />
        </Stack>

        <Group justify="center" mt="xl"> {/* Centered button */}
            <Link to="/jotformbuilder" style={{textDecoration:'none'}}>
          <Button type="submit" radius="xl">
            Create Form
          </Button>
          </Link>
        </Group>
      </form>
    </Paper>
  );
}
