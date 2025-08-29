// JotformViewer.jsx
import React from "react";
import RenderJotform from "./RenderJotform";
// import reactForm from "../../assets/testing with properties.json" // ✅ your saved form JSON

export function JotformViewer({ onBack }) {
  // For now, we only have react.json → later you can map different .jsons
  const formData = {
    "id": 1,
    "jotformName": "react",
    "totalPages": 2,
    "pages": [
        {
            "id": 1,
            "page": 1,
            "totalElements": 4,
            "elements": [
                {
                    "id": 1755079112816,
                    "tagName": "paragraph",
                    "elementName": "Paragraph",
                    "content": "content regarding the image as shown in the above ...re you can refer to the",
                    "sequence": 4
                },
                {
                    "id": 1755079178728,
                    "tagName": "horizontalline",
                    "elementName": "Horizontal Line",
                    "content": "Horizontal divider line",
                    "sequence": 2
                },
                {
                    "id": 1755079183626,
                    "tagName": "image",
                    "elementName": "Image",
                    "content": "https://postman.com/_aether-assets/illustrations/dark/illustration-join-team.svg",
                    "sequence": 3
                },
                {
                    "id": 1755079193189,
                    "tagName": "heading",
                    "elementName": "Heading",
                    "content": "Main Heding",
                    "sequence": 1
                }
            ]
        },
        {
            "id": 2,
            "page": 2,
            "totalElements": 3,
            "elements": [
                {
                    "id": 1755079207601,
                    "tagName": "heading",
                    "elementName": "Heading",
                    "content": "Sub Heading",
                    "sequence": 1
                },
                {
                    "id": 1755079222481,
                    "tagName": "horizontalline",
                    "elementName": "Horizontal Line",
                    "content": "Horizontal divider line",
                    "sequence": 2
                },
                {
                    "id": 1755079304470,
                    "tagName": "video",
                    "elementName": "Video",
                    "content": "https://www.youtube.com/watch?v=GA0u6WM7_Eo&list=PLZoTAELRMXVNUL99R4bD1VYsncUNVWUBB",
                    "sequence": 3
                }
            ]
        }
    ]
};

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={onBack}
        style={{
          background: "#333",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        ⬅ Back
      </button>
      <RenderJotform formData={formData} />
    </div>
  );
}
