import React, { useState, useEffect } from 'react';
import {
  Container,
  Group,
  SegmentedControl,
  Table,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';

export function CourseManagement() {
  const [selectedGroup, setSelectedGroup] = useState('BL');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/api/courses?group=${selectedGroup}`);
        setCourses(response.data); // Assuming response.data is an array of courses
        console.log(response.data);
      } catch (error) {
        console.error(`Error fetching courses for group ${selectedGroup}:`, error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedGroup]);

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

      {loading ? (
        <Text ta="center" c="dimmed">
          Loading courses...
        </Text>
      ) : courses.length > 0 ? (
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
                <Table.Td>{course.learningJotformName}</Table.Td>
                <Table.Td>{course.assignmentJotformName}</Table.Td>
                <Table.Td>{course.imageFileName}</Table.Td>
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
