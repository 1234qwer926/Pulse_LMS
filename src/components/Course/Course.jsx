import React, { useState } from "react";
import { Container, Title, Button, Group, Text } from "@mantine/core";
import { JotformViewer } from "./JotformViewer";
import { CourseTable } from "./CourseTable";
import { CourseGrid } from "./CourseGrid";

export function Course() {
  // ✅ Static dummy data
  const dummyCourses = [
    {
      courseId: 1,
      courseName: "Pharma Compliance Basics",
      learningJotformName: "Pharma Learning Form",
      assignmentJotformName: "Pharma Assignment Form",
      imageFileName: "mindmap1.png",
    },
    {
      courseId: 2,
      courseName: "Advanced Marketing Strategies",
      learningJotformName: "Marketing Learning Form",
      assignmentJotformName: "Marketing Assignment Form",
      imageFileName: "mindmap2.png",
    },
    {
      courseId: 3,
      courseName: "Field Operations Training",
      learningJotformName: "Field Ops Learning Form",
      assignmentJotformName: "Field Ops Assignment Form",
      imageFileName: "mindmap3.png",
    },
  ];

  const [view, setView] = useState("list"); // "list" | "grid" | "viewer"
  const [selectedJotform, setSelectedJotform] = useState(null);
  const group = "BL";

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
        Course Management
      </Title>

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

      {dummyCourses.length > 0 ? (
        view === "list" ? (
          <CourseTable
            courses={dummyCourses}
            onViewJotform={handleViewJotform}
          />
        ) : (
          <CourseGrid
            courses={dummyCourses}
            group={group}
            onViewJotform={handleViewJotform}
          />
        )
      ) : (
        <Text ta="center" c="dimmed">
          No courses available for this group.
        </Text>
      )}
    </Container>
  );
}
