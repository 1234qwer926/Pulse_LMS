import React, { useEffect, useState } from 'react';
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
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';


import classes from '../AuthenticationForm/AuthenticationForm.module.css';


const GROUPS = ['BL', 'BE', 'BM'];


export function JotformMapping(props) {
  const [formType, setFormType] = useState('learning');
  const [loadingForms, setLoadingForms] = useState(false);
  const [jotformNames, setJotformNames] = useState([]);
  const [courseNames, setCourseNames] = useState([]); // New state for existing courses
  const [loadingCourses, setLoadingCourses] = useState(false);


  const fetchJotformNames = async () => {
    setLoadingForms(true);
    try {
      const response = await axios.get('https://18.60.40.186:8081/api/jotforms/names');
      setJotformNames(response.data);
    } catch (error) {
      console.error('Error fetching jotform names', error);
      setJotformNames([]);
    } finally {
      setLoadingForms(false);
    }
  };


  const fetchExistingCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await axios.get('https://18.60.40.186:8081/api/courses/names');
      setCourseNames(response.data); // Assuming response is a list of distinct course names
    } catch (error) {
      console.error('Error fetching existing courses', error);
      setCourseNames([]);
    } finally {
      setLoadingCourses(false);
    }
  };


  useEffect(() => {
    fetchJotformNames();
    fetchExistingCourses(); // Fetch courses for assignment mapping
  }, []);


  // learning form (unchanged, for new course creation)
  const learningForm = useForm({
    initialValues: {
      courseName: '',
      jotformName: '',
      group: '',
      imageFile: null,
      pdfFile: null,
    },
    validate: {
      courseName: (val) => (val.trim().length > 0 ? null : 'Please enter a course name'),
      jotformName: (val) => (val ? null : 'Please select a Jotform'),
      group: (val) => (val ? null : 'Please select a group'),
    },
  });


  const submitLearningForm = async (values) => {
    try {
      const formData = new FormData();
      formData.append('courseName', values.courseName);
      formData.append('jotformName', values.jotformName);
      formData.append('group', values.group);
      if (values.imageFile) formData.append('imageFile', values.imageFile);
      if (values.pdfFile) formData.append('pdfFile', values.pdfFile);

      console.log(formData)
      const response = await axios.post('https://18.60.40.186:8081/api/courses/learning', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('Mapping submission response:', response.data);
      alert('Learning form mapped successfully!');
    } catch (error) {
      console.error('Error submitting learning form mapping', error);
      alert('Failed to submit mapping');
    }
  };


  // assignment form (updated to select from existing courses)
  const assignmentForm = useForm({
    initialValues: {
      courseName: '', // Now selected from existing
      jotformName: '',
      group: '',
    },
    validate: {
      courseName: (val) => (val ? null : 'Please select a course name'),
      jotformName: (val) => (val ? null : 'Please select a jotform'),
      group: (val) => (val ? null : 'Please select a group'),
    },
  });


  const submitAssignmentForm = async (values) => {
    try {
      const payload = {
        courseName: values.courseName,
        jotformName: values.jotformName,
        group: values.group,
      };


      const response = await axios.post('https://18.60.40.186:8081/api/courses/assignment', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      console.log('Assignment mapping response:', response.data);
      alert('Assignment form mapped successfully!');
    } catch (error) {
      console.error('Error submitting assignment mapping', error);
      alert('Failed to submit assignment mapping');
    }
  };


  return (
    <Paper
      className={classes.formPaper}
      radius="md"
      p="lg"
      withBorder
      {...props}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Text size="lg" fw={500} ta="center">Jotform Mapping</Text>


      <Group position="center" mt="md" mb="lg">
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
        <form onSubmit={learningForm.onSubmit(submitLearningForm)}>
          <Stack>
            <TextInput
              label="Course Name"
              placeholder="Enter course name"
              required
              value={learningForm.values.courseName}
              onChange={(e) => learningForm.setFieldValue('courseName', e.currentTarget.value)}
              error={learningForm.errors.courseName}
              radius="md"
            />


            <Select
              label="Jotform Name"
              placeholder={loadingForms ? 'Loading...' : 'Select existing jotform'}
              required
              searchable
              data={jotformNames}
              value={learningForm.values.jotformName}
              onChange={(val) => learningForm.setFieldValue('jotformName', val)}
              error={learningForm.errors.jotformName}
              radius="md"
              disabled={loadingForms}
            />


            <Select
              label="Group"
              placeholder="Select group"
              required
              data={GROUPS}
              value={learningForm.values.group}
              onChange={(val) => learningForm.setFieldValue('group', val)}
              error={learningForm.errors.group}
              radius="md"
            />


            <FileInput
              label="Upload Image"
              placeholder="Select image file"
              accept="image/*"
              value={learningForm.values.imageFile}
              onChange={(file) => learningForm.setFieldValue('imageFile', file)}
              radius="md"
              clearable
            />


            <FileInput
              label="Upload PDF"
              placeholder="Select pdf file"
              accept="application/pdf"
              value={learningForm.values.pdfFile}
              onChange={(file) => learningForm.setFieldValue('pdfFile', file)}
              radius="md"
              clearable
            />


            <Button type="submit" radius="xl" mt="md">
              Map Learning Jotform
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={assignmentForm.onSubmit(submitAssignmentForm)}>
          <Stack>
            <Select
              label="Course Name"
              placeholder={loadingCourses ? 'Loading...' : 'Select existing course'}
              required
              searchable
              data={courseNames}
              value={assignmentForm.values.courseName}
              onChange={(val) => assignmentForm.setFieldValue('courseName', val)}
              error={assignmentForm.errors.courseName}
              radius="md"
              disabled={loadingCourses}
            />


            <Select
              label="Jotform Name"
              placeholder="Select jotform"
              required
              data={jotformNames}
              value={assignmentForm.values.jotformName}
              onChange={(val) => assignmentForm.setFieldValue('jotformName', val)}
              error={assignmentForm.errors.jotformName}
              radius="md"
            />


            <Select
              label="Group"
              placeholder="Select group"
              required
              data={GROUPS}
              value={assignmentForm.values.group}
              onChange={(val) => assignmentForm.setFieldValue('group', val)}
              error={assignmentForm.errors.group}
              radius="md"
            />


            <Button type="submit" radius="xl" mt="md">
              Map Assignment Jotform
            </Button>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
