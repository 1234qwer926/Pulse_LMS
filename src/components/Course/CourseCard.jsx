import React from "react";

export function CourseCard({ course, group, onViewJotform }) {
  return (
    <div className="bg-gray-800 border border-gray-700 shadow-md rounded-xl p-6 hover:shadow-xl transition flex flex-col justify-between">
      
      {/* Course Info */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {course.courseName}
        </h3>
        <p className="text-sm text-gray-400">Group: {group}</p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onViewJotform(course.learningJotformName)}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition"
        >
          Learning Form
        </button>
        <button
          onClick={() => onViewJotform(course.assignmentJotformName)}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition"
        >
          Assignment
        </button>
      </div>
    </div>
  );
}
