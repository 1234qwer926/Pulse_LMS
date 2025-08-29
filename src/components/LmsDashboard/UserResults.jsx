import React, { useState, useEffect } from 'react';
import { Container, Title, Table, Text, Button } from '@mantine/core';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock data for user results in a specific course
const mockUserResults = [
  { userId: 101, username: 'Alice', score: 90 },
  { userId: 102, username: 'Bob', score: 85 },
  { userId: 103, username: 'Charlie', score: 95 },
];

export function UserResults() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName } = location.state || { courseName: 'Course' };

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserResults = async () => {
    setLoading(true);
    try {
      // In a real application, you would fetch this data from your API
      // const response = await axios.get(`http://localhost:8081/api/results/course/${courseId}`);
      // setResults(response.data);

      // Using mock data for this example
      setResults(mockUserResults);

    } catch (error) {
      console.error(`Error fetching user results for course ${courseId}:`, error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserResults();
  }, [courseId]);

  const handleUserClick = (user) => {
    navigate(`/assignment-review/${courseId}/${user.userId}`, { state: { username: user.username, courseName } });
  };

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">{courseName} - User Results</Title>

      {loading ? (
        <Text ta="center" c="dimmed">Loading user results...</Text>
      ) : results.length > 0 ? (
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Username</Table.Th>
              <Table.Th>Score</Table.Th>
              <Table.Th>Answers</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {results.map((user) => (
              <Table.Tr key={user.userId} style={{ cursor: 'pointer' }}>
                <Table.Td onClick={() => handleUserClick(user)}>{user.username}</Table.Td>
                <Table.Td onClick={() => handleUserClick(user)}>{user.score}</Table.Td>
                <Table.Td>
                  <Button variant="outline" size="xs" onClick={() => handleUserClick(user)}>
                    View Details
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text ta="center" c="dimmed">No user results found for this course.</Text>
      )}
    </Container>
  );
}
