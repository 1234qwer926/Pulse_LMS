// JotformMapping.jsx
import {
  Button,
  Divider,
  FileInput,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../AuthenticationForm/AuthenticationForm.module.css'; // Reuse the same CSS module for similar styling (adjust path if needed)
import { useState } from 'react';

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
  const [formType, setFormType] = useState('learning'); // Default to 'learning'

  // Form for Jotform Learning (with image and PDF)
  const learningForm = useForm({
    initialValues: {
      courseName: '',
      jotformName: '',
      group: '',
      imageFile: null,
      pdfFile: null,
    },

    validate: {
      courseName: (val) => (val ? null : 'Please select a course name'),
      jotformName: (val) => (val ? null : 'Please select a Jotform name'),
      group: (val) => (val ? null : 'Please select a group'),
    },
  });

  // Form for Jotform Assignment (without image and PDF)
  const assignmentForm = useForm({
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

      {/* Toggle button centered at the top */}
      <Group justify="center" mt="md" mb="lg">
        <SegmentedControl
          value={formType}
          onChange={setFormType}
          data={[
            { label: 'Jotform Learning', value: 'learning' },
            { label: 'Jotform Assignment', value: 'assignment' },
          ]}
          color="blue"
          size="md"
        />
      </Group>

      <Divider label="Select mapping details" labelPosition="center" my="lg" />

      {formType === 'learning' ? (
        // Learning Form
        <form onSubmit={learningForm.onSubmit((values) => console.log('Mapping Jotform Learning:', values))}>
          <Stack>
            <Select
              required
              label="Course Name"
              placeholder="Select course"
              data={COURSE_NAMES}
              value={learningForm.values.courseName}
              onChange={(value) => learningForm.setFieldValue('courseName', value)}
              error={learningForm.errors.courseName && 'Please select a course name'}
              radius="md"
            />

            <Select
              required
              label="Jotform Name"
              placeholder="Select Jotform"
              data={JOTFORM_NAMES}
              value={learningForm.values.jotformName}
              onChange={(value) => learningForm.setFieldValue('jotformName', value)}
              error={learningForm.errors.jotformName && 'Please select a Jotform name'}
              radius="md"
            />

            <Select
              required
              label="Group"
              placeholder="Select group"
              data={GROUPS}
              value={learningForm.values.group}
              onChange={(value) => learningForm.setFieldValue('group', value)}
              error={learningForm.errors.group && 'Please select a group'}
              radius="md"
            />

            <FileInput
              label="Upload Image"
              placeholder="Select image file"
              accept="image/*" // Restrict to images
              value={learningForm.values.imageFile}
              onChange={(file) => learningForm.setFieldValue('imageFile', file)}
              radius="md"
              clearable
            />

            <FileInput
              label="Upload PDF"
              placeholder="Select PDF file"
              accept="application/pdf" // Restrict to PDFs
              value={learningForm.values.pdfFile}
              onChange={(file) => learningForm.setFieldValue('pdfFile', file)}
              radius="md"
              clearable
            />
          </Stack>

          <Group justify="center" mt="xl"> {/* Centered button */}
            <Button type="submit" radius="xl">
              Map Jotform Learning
            </Button>
          </Group>
        </form>
      ) : (
        // Assignment Form
        <form onSubmit={assignmentForm.onSubmit((values) => console.log('Mapping Jotform Assignment:', values))}>
          <Stack>
            <Select
              required
              label="Course Name"
              placeholder="Select course"
              data={COURSE_NAMES}
              value={assignmentForm.values.courseName}
              onChange={(value) => assignmentForm.setFieldValue('courseName', value)}
              error={assignmentForm.errors.courseName && 'Please select a course name'}
              radius="md"
            />

            <Select
              required
              label="Jotform Name"
              placeholder="Select Jotform"
              data={JOTFORM_NAMES}
              value={assignmentForm.values.jotformName}
              onChange={(value) => assignmentForm.setFieldValue('jotformName', value)}
              error={assignmentForm.errors.jotformName && 'Please select a Jotform name'}
              radius="md"
            />

            <Select
              required
              label="Group"
              placeholder="Select group"
              data={GROUPS}
              value={assignmentForm.values.group}
              onChange={(value) => assignmentForm.setFieldValue('group', value)}
              error={assignmentForm.errors.group && 'Please select a group'}
              radius="md"
            />
          </Stack>

          <Group justify="center" mt="xl"> {/* Centered button */}
            <Button type="submit" radius="xl">
              Map Jotform Assignment
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
}
