import React, { useState, useEffect } from 'react';
import { Container, Title, Table, Text, ActionIcon, NumberInput, Group } from '@mantine/core';
import { IconPencil, IconDeviceFloppy } from '@tabler/icons-react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export function AssignmentReview() {
  const { courseId, userId } = useParams();
  const location = useLocation();
  const { username } = location.state || { username: 'User' };
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`  https://18.60.40.186/api/assignment/${courseId}/${userId}`);
        const dataWithEditingState = response.data.map(item => ({
          ...item,
          editing: false,
          tempScore: item.finalScore
        }));
        setAssignment(dataWithEditingState);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        setAssignment([]);
      } finally {
        setLoading(false);
      }
    };
    if (courseId && userId) {
      fetchAssignmentDetails();
    }
  }, [courseId, userId]);

  const handleEditToggle = (id) => {
    setAssignment(assignment.map(item =>
      item.id === id ? { ...item, editing: !item.editing, tempScore: item.finalScore } : item
    ));
  };
  
  const handleScoreChange = (id, value) => {
    setAssignment(assignment.map(item =>
      item.id === id ? { ...item, tempScore: value } : item
    ));
  };

  const handleSaveScore = async (id) => {
    const itemToSave = assignment.find(item => item.id === id);
    if (!itemToSave) return;
    
    try {
      await axios.put(`  https://18.60.40.186/api/assignment/score/${id}`, { finalScore: itemToSave.tempScore });
      setAssignment(assignment.map(item =>
        item.id === id ? { ...item, finalScore: itemToSave.tempScore, editing: false } : item
      ));
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };
  
  const totalFinalScore = assignment.reduce((acc, curr) => acc + curr.finalScore, 0);

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={3}>Assignment Review for: {username}</Title>
      </Group>
      {loading ? (
        <Text>Loading assignment details...</Text>
      ) : (
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Question</Table.Th>
              <Table.Th>User Answer</Table.Th>
              <Table.Th>Content Link</Table.Th>
              <Table.Th>GPT Score</Table.Th>
              <Table.Th>Final Score</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {assignment.map(item => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.question}</Table.Td>
                <Table.Td>{item.userAnswer}</Table.Td>
                <Table.Td>
                  <a href={item.contentLink} target="_blank" rel="noopener noreferrer">View Content</a>
                </Table.Td>
                <Table.Td>{item.gptScore}</Table.Td>
                <Table.Td>
                  {item.editing ? (
                    <NumberInput
                      value={item.tempScore}
                      onChange={(value) => handleScoreChange(item.id, value)}
                      min={0}
                      max={100} // Assuming max score is 100
                      size="xs"
                      style={{ width: 80 }}
                    />
                  ) : (
                    item.finalScore
                  )}
                </Table.Td>
                <Table.Td>
                  {item.editing ? (
                    <ActionIcon variant="subtle" color="green" onClick={() => handleSaveScore(item.id)}>
                      <IconDeviceFloppy size={18} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEditToggle(item.id)}>
                      <IconPencil size={18} />
                    </ActionIcon>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr>
              <Table.Td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Score</Table.Td>
              <Table.Td style={{ fontWeight: 'bold' }}>{totalFinalScore}</Table.Td>
              <Table.Td />
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      )}
    </Container>
  );
}
