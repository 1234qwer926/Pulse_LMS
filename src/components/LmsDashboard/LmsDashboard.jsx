// LmsDashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Table,
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
          <Link to="/mapuser" style={{textDecoration:'none'}}>
            <Card shadow="md" radius="md" p="lg" style={{ background: 'var(--mantine-color-dark-7)' }}>
            
            <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
            User Managment
            </Text>
            
            <Text size="sm" color="dimmed" mb="md">
              Create,Read,Update and Delete Map users to groups for targeted learning.
            </Text>
            <Button variant="light" color="blue" fullWidth>
              User Managment
            </Button>
          </Card>
          </Link>
          <Link to="/jotformmanagment" style={{textDecoration:'none'}}>
          <Card shadow="md" radius="md" p="lg" style={{ background: 'var(--mantine-color-dark-7)' }}>
            <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
              Jotform Managment
            </Text>
            <Text size="sm" color="dimmed" mb="md">
              Create,Read,Update and Delete  learning Material or assignment Materials.
            </Text>
            
            <Button variant="light" color="blue" fullWidth>
              Jotform Managment
            </Button>
            
            
          </Card>
          </Link>
          <Link to="/jotformmapping" style={{textDecoration:'none'}}>
          <Card shadow="md" radius="md" p="lg" style={{ background: 'var(--mantine-color-dark-7)' }}>
            <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
              Course Managment
            </Text>
            <Text size="sm" color="dimmed" mb="md">
              Create,Read,Update and Delete  Jotforms to courses for each group.
            </Text>
            <Button variant="light" color="blue" fullWidth>
              Course Mangment
            </Button>
          </Card>
          </Link>
          <Link to="/coursemanagment" style={{textDecoration:'none'}}>
          <Card shadow="md" radius="md" p="lg" style={{ background: 'var(--mantine-color-dark-7)' }}>
            <Text size="lg" fw={600} style={{ color: 'var(--mantine-color-white)' }} mb={6}>
              Groups
            </Text>
            <Text size="sm" color="dimmed" mb="md">
              Manage and view groups: BL, BE, BM.
            </Text>
            <Button variant="light" color="blue" fullWidth>
              View Groups
            </Button>
          </Card>
          </Link>
          
        </SimpleGrid>

        {/* <Card shadow="md" radius="md" p="lg" style={{ background: 'var(--mantine-color-dark-7)' }}>
          
          
        </Card> */}
      </Container>
    </Box>
  );
}
