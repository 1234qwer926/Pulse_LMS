// CourseManagement.jsx
import React, { useState } from 'react';
import {
  Container,
  Group,
  SegmentedControl,
  Table,
  Text,
  Title,
} from '@mantine/core';

// Static object for course data (later replace with API)
const courseData = {
  BL: [
    {
      courseName: 'Compliance Training',
      jotformLearning: 'Learning Form 1',
      jotformAssignment: 'Assignment 1',
      mindMap: 'Mind Map BL-1',
    },
    {
      courseName: 'GMP Overview',
      jotformLearning: 'Learning Form 2',
      jotformAssignment: 'Assignment 2',
      mindMap: 'Mind Map BL-2',
    },
  ],
  BE: [
    {
      courseName: 'Advanced Pharmacology',
      jotformLearning: 'Learning Form 3',
      jotformAssignment: 'Assignment 3',
      mindMap: 'Mind Map BE-1',
    },
  ],
  BM: [
    {
      courseName: 'Sales Skill Booster',
      jotformLearning: 'Learning Form 4',
      jotformAssignment: 'Assignment 4',
      mindMap: 'Mind Map BM-1',
    },
    {
      courseName: 'Team Leadership',
      jotformLearning: 'Learning Form 5',
      jotformAssignment: 'Assignment 5',
      mindMap: 'Mind Map BM-2',
    },
  ],
};

export function CourseManagement() {
  const [selectedGroup, setSelectedGroup] = useState('BL');

  const courses = courseData[selectedGroup] || [];

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="md">
        Course Management
      </Title>

      <Group justify="center" mb="xl">
        <SegmentedControl
          value={selectedGroup}
          onChange={setSelectedGroup}
          data={[
            { label: 'BL', value: 'BL' },
            { label: 'BE', value: 'BE' },
            { label: 'BM', value: 'BM' },
          ]}
          size="md"
          color="blue"
        />
      </Group>

      {courses.length > 0 ? (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course Name</Table.Th>
              <Table.Th>Jotform Learning</Table.Th>
              <Table.Th>Jotform Assignment</Table.Th>
              <Table.Th>Mind Map</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {courses.map((course, index) => (
              <Table.Tr key={index}>
                <Table.Td>{course.courseName}</Table.Td>
                <Table.Td>{course.jotformLearning}</Table.Td>
                <Table.Td>{course.jotformAssignment}</Table.Td>
                <Table.Td>{course.mindMap}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text ta="center" c="dimmed">
          No courses available for this group.
        </Text>
      )}
    </Container>
  );
}
