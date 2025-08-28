import React, { useState, useEffect } from 'react';
import {
  Container,
  Group,
  SegmentedControl,
  Table,
  Text,
  Title,
  Button,
  Modal,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { JotformMapping } from './JotformMapping'; // Assuming you have this component

export function CourseManagement() {
  const [selectedGroup, setSelectedGroup] = useState('BL');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for the "Map Jotforms" modal
  const [mapModalOpened, setMapModalOpened] = useState(false);

  // State for the delete confirmation modal
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/courses?group=${selectedGroup}`);
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      console.error(`Error fetching courses for group ${selectedGroup}:`, error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedGroup]);

  const handleEdit = (course) => {
    console.log('Editing course:', course);
    // Logic for editing a course will go here
  };
  
  // Opens the delete confirmation modal
  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpened(true);
  };

  // Closes the delete confirmation modal
  const closeDeleteModal = () => {
    setCourseToDelete(null);
    setDeleteModalOpened(false);
  };

  // Handles the actual deletion once confirmed
  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      await axios.delete(`http://localhost:8081/api/courses/${courseToDelete.id}`);
      // Refresh the list of courses after successful deletion
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
      closeDeleteModal(); // Close the modal
    } catch (error) {
      console.error(`Error deleting course ${courseToDelete.courseName}:`, error);
      // Optionally, show an error notification
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Course Management</Title>
        <Button onClick={() => setMapModalOpened(true)}>Map Jotforms</Button>
      </Group>

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
        <Text ta="center" c="dimmed">Loading courses...</Text>
      ) : courses.length > 0 ? (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course Name</Table.Th>
              <Table.Th>Jotform Learning</Table.Th>
              <Table.Th>Jotform Assignment</Table.Th>
              <Table.Th>Mind Map</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {courses.map((course) => (
              // The key prop is essential for React to identify which items have changed.
              
              <Table.Tr key={course.id}> 
                <Table.Td>{course.courseName}</Table.Td>
                <Table.Td>{course.learningJotformName || 'N/A'}</Table.Td>
                <Table.Td>{course.assignmentJotformName || 'N/A'}</Table.Td>
                <Table.Td>{course.imageFileName || 'N/A'}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="center">
                    <Tooltip label="Edit Course">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(course)}>
                        <IconPencil size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Course">
                      <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(course)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text ta="center" c="dimmed">No courses available for this group.</Text>
      )}

      {/* Modal for Mapping Jotforms */}
      <Modal
        opened={mapModalOpened}
        onClose={() => setMapModalOpened(false)}
        title="Map Jotform to Course"
        size="xl"
      >
        <JotformMapping
          onSuccess={() => {
            setMapModalOpened(false);
            fetchCourses();
          }}
        />
      </Modal>

      {/* Modal for Deleting a Course */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={`Delete ${courseToDelete?.courseName || 'Course'}`}
        centered
      >
        <Text>Are you sure you want to delete this course? This action cannot be undone.</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete Course
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
