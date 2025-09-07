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
  Tooltip, // Added for better UX
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals'; // 1. Import the modals manager
import axios from 'axios';
import { CreateJotform } from './CreateJotform';

export function JotformManagement() {
  const [jotforms, setJotforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createJotformModalOpened, setCreateJotformModalOpened] = useState(false);

  const fetchJotforms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://18.60.40.186/api/jotforms');
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

  // --- NEW DELETE MODAL LOGIC ---

  // 2. Handles the actual API call after confirmation
  const confirmDelete = async (formToDelete) => {
    try {
      await axios.delete(`https://18.60.40.186/api/jotforms/${formToDelete.id}`);
      // Update state immediately for a responsive UI
      setJotforms((currentForms) =>
        currentForms.filter((form) => form.id !== formToDelete.id)
      );
      // Optionally, add a success notification here
    } catch (error) {
      console.error(`Error deleting jotform ${formToDelete.id}:`, error);
      alert('Failed to delete Jotform.');
    }
  };

  // 3. Opens the confirmation modal
  const openDeleteModal = (form) => {
    modals.openConfirmModal({
      title: 'Delete Jotform',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the form{' '}
          <Text span fw={700}>"{form.jotformName}"</Text>?
          This action is permanent.
        </Text>
      ),
      labels: { confirm: 'Delete Jotform', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => confirmDelete(form),
    });
  };

  // --- RENDER LOGIC ---

  const rows = jotforms.map((form) => (
    <Table.Tr key={form.id}>
      <Table.Td>{form.jotformName}</Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Tooltip label="Edit Form">
            <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(form.id)}>
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Form">
            {/* 4. Update onClick to trigger the modal */}
            <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(form)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const handleCloseCreateModal = () => {
    setCreateJotformModalOpened(false);
    fetchJotforms(); // Refresh list after creating a new form
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
        onClose={() => setCreateJotformModalOpened(false)} // Close without re-fetching
        title="Create New Jotform"
        centered
      >
        {/* Pass the success handler to the CreateJotform component */}
        <CreateJotform onSuccess={handleCloseCreateModal} />
      </Modal>
    </Container>
  );
}
