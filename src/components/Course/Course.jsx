import React, { useState, useEffect } from "react";
import { Container, Title, Button, Group, Text, SegmentedControl, Loader } from "@mantine/core";
import axios from "axios";
import { JotformViewer } from "./JotformViewer";
import { CourseTable } from "./CourseTable";
import { CourseGrid } from "./CourseGrid";

export function Course() {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState("list"); // "list" | "grid" | "viewer"
  const [selectedJotform, setSelectedJotform] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("BL"); // Default group
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8081/api/courses?group=${selectedGroup}`);
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedGroup]); // Refetch when the group changes

  const handleViewJotform = (jotformName) => {
    if (jotformName) {
      setSelectedJotform(jotformName);
      setView("viewer");
    }
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedJotform(null);
  };

  if (view === "viewer") {
    return (
      <JotformViewer jotformName={selectedJotform} onBack={handleBackToList} />
    );
  }

  return (
    <Container size="lg" py="xl">
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

      <Group justify="center" mb="md">
        <Button
          variant={view === "list" ? "filled" : "light"}
          onClick={() => setView("list")}
        >
          Table View
        </Button>
        <Button
          variant={view === "grid" ? "filled" : "light"}
          onClick={() => setView("grid")}
        >
          Grid View
        </Button>
      </Group>

      {loading ? (
        <Group justify="center">
            <Loader />
            <Text>Loading courses...</Text>
        </Group>
      ) : error ? (
        <Text ta="center" c="red">{error}</Text>
      ) : courses.length > 0 ? (
        view === "list" ? (
          <CourseTable courses={courses} onViewJotform={handleViewJotform} />
        ) : (
          <CourseGrid
            courses={courses}
            group={selectedGroup}
            onViewJotform={handleViewJotform}
          />
        )
      ) : (
        <Text ta="center" c="dimmed">
          No courses available for the '{selectedGroup}' group.
        </Text>
      )}
    </Container>
  );
}
