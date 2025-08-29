import React, { useState, useEffect } from 'react';
import { Container, Group, SegmentedControl, Table, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock data for demonstration purposes
const mockCourses = {
  BL: [
    { id: 1, courseName: 'BL Course 1', averageScore: 85 },
    { id: 2, courseName: 'BL Course 2', averageScore: 92 },
  ],
  BE: [
    { id: 3, courseName: 'BE Course A', averageScore: 78 },
    { id: 4, courseName: 'BE Course B', averageScore: 88 },
  ],
  BM: [
    { id: 5, courseName: 'BM Tech Course', averageScore: 95 },
  ],
};

export function ResultManagement() {
  const [selectedGroup, setSelectedGroup] = useState('BL');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCourseResults = async () => {
    setLoading(true);
    try {
      // In a real application, you would fetch data from your API
      // const response = await axios.get(`http://localhost:8081/api/results?group=${selectedGroup}`);
      // setCourses(response.data);

      // Using mock data for this example
      setCourses(mockCourses[selectedGroup] || []);

    } catch (error) {
      console.error(`Error fetching results for group ${selectedGroup}:`, error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseResults();
  }, [selectedGroup]);

  const handleRowClick = (course) => {
    navigate(`/user-results/${course.id}`, { state: { courseName: course.courseName } });
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">Result Management</Title>

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
        <Text ta="center" c="dimmed">Loading results...</Text>
      ) : courses.length > 0 ? (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course Name</Table.Th>
              <Table.Th>Average Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {courses.map((course) => (
              <Table.Tr
                key={course.id}
                onClick={() => handleRowClick(course)}
                style={{ cursor: 'pointer' }}
              >
                <Table.Td>{course.courseName}</Table.Td>
                <Table.Td>{course.averageScore}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text ta="center" c="dimmed">No results available for this group.</Text>
      )}
    </Container>
  );
}
