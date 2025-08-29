import React from "react";

export function CourseTable({ courses, onViewJotform }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #444",
      }}
    >
      <thead>
        <tr style={{ background: "#111", color: "#fff" }}>
          <th style={{ padding: "8px" }}>Course Name</th>
          <th style={{ padding: "8px" }}>Jotform Learning</th>
          <th style={{ padding: "8px" }}>Jotform Assignment</th>
          <th style={{ padding: "8px" }}>Mind Map</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr
            key={course.courseId}
            style={{ borderTop: "1px solid #333", color: "#ddd" }}
          >
            <td style={{ padding: "8px" }}>{course.courseName}</td>
            <td
              onClick={() => onViewJotform(course.learningJotformName)}
              style={{
                cursor: "pointer",
                color: "skyblue",
                textDecoration: "underline",
                padding: "8px",
              }}
            >
              {course.learningJotformName}
            </td>
            <td
              onClick={() => onViewJotform(course.assignmentJotformName)}
              style={{
                cursor: "pointer",
                color: "skyblue",
                textDecoration: "underline",
                padding: "8px",
              }}
            >
              {course.assignmentJotformName}
            </td>
            <td style={{ padding: "8px" }}>{course.imageFileName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
