import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Table,
  Text,
  Modal,
  ActionIcon,
  Loader,
  Center,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { CreateJotform } from './CreateJotform';

export function JotformManagement() {
  const [jotforms, setJotforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createJotformModalOpened, setCreateJotformModalOpened] = useState(false);

  const fetchJotforms = async () => {
    setLoading(true);
    try {
      // Corrected to use the standard REST endpoint for getting all resources
      const response = await axios.get('http://localhost:8081/api/jotforms');
      setJotforms(response.data);
    } catch (error) {
      console.error('Error fetching Jotforms:', error);
      setJotforms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJotforms();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit Jotform with ID: ${id}`);
    alert('Edit functionality to be implemented.');
  };

  // This handleDelete function correctly calls the new backend endpoint
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axios.delete(`http://localhost:8081/api/jotforms/${id}`);
        fetchJotforms(); // Refresh the list after successful deletion
      } catch (error) {
        console.error(`Error deleting jotform ${id}:`, error);
        alert('Failed to delete Jotform.');
      }
    }
  };

  const rows = jotforms.map((form) => (
    <Table.Tr key={form.id}>
      <Table.Td>{form.jotformName}</Table.Td>
      <Table.Td>
        <Group gap="sm">
          <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(form.id)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(form.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const handleCloseCreateModal = () => {
    setCreateJotformModalOpened(false);
    fetchJotforms();
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Jotform Management</Title>
        <Button onClick={() => setCreateJotformModalOpened(true)}>
          Create Jotform
        </Button>
      </Group>

      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Jotform Name</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text c="dimmed" ta="center">
                    No Jotforms found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={createJotformModalOpened}
        onClose={handleCloseCreateModal}
        title="Create New Jotform"
        centered
      >
        <CreateJotform />
      </Modal>
    </Container>
  );
}
