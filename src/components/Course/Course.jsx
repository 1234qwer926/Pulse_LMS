import React, { useState, useEffect } from 'react';
import { Container, Table, Text, Title, Loader } from '@mantine/core';
import axios from 'axios';
import { JotformViewer } from './JotformViewer';

export function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [selectedJotform, setSelectedJotform] = useState(null);
  const group = 'BL';

  useEffect(() => {
    if (view === 'list') {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8081/api/courses?group=${group}`);
          setCourses(response.data);
        } catch (error) {
          console.error(`Error fetching courses for group ${group}:`, error);
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [view]);

  const handleViewJotform = (jotformName) => {
    if (jotformName) {
      setSelectedJotform(jotformName);
      setView('viewer');
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedJotform(null);
  };

  if (view === 'viewer') {
    return <JotformViewer jotformName={selectedJotform} onBack={handleBackToList} />;
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="md">
        Course Management
      </Title>

      {loading ? (
        <Text ta="center" c="dimmed">
          <Loader />
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
            {/* FIX: Added a unique key to the Table.Tr element */}
            {courses.map((course) => (
              <Table.Tr key={course.courseId}>
                <Table.Td>{course.courseName}</Table.Td>
                <Table.Td
                  onClick={() => handleViewJotform(course.learningJotformName)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {course.learningJotformName}
                </Table.Td>
                <Table.Td
                  onClick={() => handleViewJotform(course.assignmentJotformName)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {course.assignmentJotformName}
                </Table.Td>
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
