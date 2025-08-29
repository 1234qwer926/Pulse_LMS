// LmsDashboard.jsx
import React from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function LmsDashboard() {
  return (
    <Box style={{ background: 'var(--mantine-color-dark-8)', padding: '32px 0' }}>
      <Container size="lg">
        <Title align="center" order={1} style={{ color: 'var(--mantine-color-white)', marginBottom: 24 }}>
          PULSE LMS Dashboard
        </Title>

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xl" mb={40}>
          {/* Card 1: User Management */}
          <Link to="/usermanagment" style={{ textDecoration: 'none', height: '100%' }}>
            <Card
              shadow="md"
              radius="md"
              p="lg"
              style={{
                background: 'var(--mantine-color-dark-7)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
                User Management
              </Text>
              <Text size="sm" color="dimmed" mb="md">
                Manage users by creating, updating, or deleting profiles and assigning them to specific learning groups.
              </Text>
              <Button variant="light" color="blue" fullWidth style={{ marginTop: 'auto' }}>
                Manage Users
              </Button>
            </Card>
          </Link>

          {/* Card 2: Jotform Management */}
          <Link to="/jotformmanagment" style={{ textDecoration: 'none', height: '100%' }}>
            <Card
              shadow="md"
              radius="md"
              p="lg"
              style={{
                background: 'var(--mantine-color-dark-7)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
                Jotform Management
              </Text>
              <Text size="sm" color="dimmed" mb="md">
                Administer learning materials and assignments by creating, editing, or removing Jotforms.
              </Text>
              <Button variant="light" color="blue" fullWidth style={{ marginTop: 'auto' }}>
                Manage Jotforms
              </Button>
            </Card>
          </Link>


          {/* Card 3: Course Management */}
          <Link to="/coursemanagment" style={{ textDecoration: 'none', height: '100%' }}>
            <Card
              shadow="md"
              radius="md"
              p="lg"
              style={{
                background: 'var(--mantine-color-dark-7)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
                Course Management
              </Text>
              <Text size="sm" color="dimmed" mb="md">
                Organize your curriculum by mapping Jotforms and other materials to specific courses for user groups.
              </Text>
              <Button variant="light" color="blue" fullWidth style={{ marginTop: 'auto' }}>
                Manage Courses
              </Button>
            </Card>
          </Link>

          {/* Card 4: Results Management */}
          <Link to="/resultmanagement" style={{ textDecoration: 'none', height: '100%' }}>
            <Card
              shadow="md"
              radius="md"
              p="lg"
              style={{
                background: 'var(--mantine-color-dark-7)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
                Results Management
              </Text>
              <Text size="sm" color="dimmed" mb="md">
                Track and analyze user performance, view assessment results, and generate progress reports.
              </Text>
              <Button variant="light" color="blue" fullWidth style={{ marginTop: 'auto' }}>
                View Results
              </Button>
            </Card>
          </Link>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
