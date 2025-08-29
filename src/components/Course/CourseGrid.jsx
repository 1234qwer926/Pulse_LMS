import React from "react";
import { CourseCard } from "./CourseCard";

export function CourseGrid({ courses, group, onViewJotform }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.courseId}
          course={course}
          group={group}
          onViewJotform={onViewJotform}
        />
      ))}
    </div>
  );
}
