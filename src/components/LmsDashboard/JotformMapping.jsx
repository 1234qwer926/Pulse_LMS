// JotformMapping.jsx
import {
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../AuthenticationForm/AuthenticationForm.module.css'; // Reuse the same CSS module for similar styling (adjust path if needed)

// Static lists (later replace with backend data)
const COURSE_NAMES = [
  'Compliance Training',
  'GMP Overview',
  'Advanced Pharmacology',
  'Sales Skill Booster',
  'Team Leadership',
];

const JOTFORM_NAMES = [
  'Learning Form 1',
  'Learning Form 2',
  'Assignment 1',
  'Assignment 2',
  'Assignment 3',
];

const GROUPS = ['BL', 'BE', 'BM'];

export function JotformMapping(props) {
  const form = useForm({
    initialValues: {
      courseName: '',
      jotformName: '',
      group: '',
    },

    validate: {
      courseName: (val) => (val ? null : 'Please select a course name'),
      jotformName: (val) => (val ? null : 'Please select a Jotform name'),
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
      <Text size="lg" fw={500} ta="center"> {/* Centered title */}
        Jotform Mapping
      </Text>

      <Divider label="Select mapping details" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit((values) => console.log('Mapping Jotform:', values))}> {/* Handle submission as needed */}
        <Stack>
          <Select
            required
            label="Course Name"
            placeholder="Select course"
            data={COURSE_NAMES}
            value={form.values.courseName}
            onChange={(value) => form.setFieldValue('courseName', value)}
            error={form.errors.courseName && 'Please select a course name'}
            radius="md"
          />

          <Select
            required
            label="Jotform Name"
            placeholder="Select Jotform"
            data={JOTFORM_NAMES}
            value={form.values.jotformName}
            onChange={(value) => form.setFieldValue('jotformName', value)}
            error={form.errors.jotformName && 'Please select a Jotform name'}
            radius="md"
          />

          <Select
            required
            label="Group"
            placeholder="Select group"
            data={GROUPS}
            value={form.values.group}
            onChange={(value) => form.setFieldValue('group', value)}
            error={form.errors.group && 'Please select a group'}
            radius="md"
          />
        </Stack>

        <Group justify="center" mt="xl"> {/* Centered button */}
          <Button type="submit" radius="xl">
            Map Jotform
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
