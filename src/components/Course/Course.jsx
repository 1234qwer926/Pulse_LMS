import React, { useState, useEffect } from "react";
import { Container, Title, Group, Text, SegmentedControl, Loader, SimpleGrid } from "@mantine/core";
import axios from "axios";
import { CourseDetail } from "./CourseDetail";
import { CourseCard } from "./CourseCard";

export function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("BL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://18.60.40.186:8081/api/courses?group=${selectedGroup}`);
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedGroup]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // Show CourseDetail component when a course is selected
  if (selectedCourse) {
    return (
      <CourseDetail 
        course={selectedCourse} 
        onBack={handleBackToCourses} 
      />
    );
  }

  // Main course list view
  return (
    <Container size="xl" py="xl">
      <Title order={2} ta="center" mb="md">
        Course Catalog
      </Title>

      <Group justify="center" mb="xl">
        <SegmentedControl
          value={selectedGroup}
          onChange={setSelectedGroup}
          data={[
            { label: "BL", value: "BL" },
            { label: "BE", value: "BE" },
            { label: "BM", value: "BM" },
          ]}
        />
      </Group>

      {loading ? (
        <Group justify="center">
          <Loader />
          <Text>Loading courses...</Text>
        </Group>
      ) : error ? (
        <Text ta="center" c="red">{error}</Text>
      ) : courses.length > 0 ? (
        <SimpleGrid 
          cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
          spacing="lg"
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={handleSelectCourse}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text ta="center" c="dimmed">
          No courses available for the '{selectedGroup}' group.
        </Text>
      )}
    </Container>
  );
}
