// JotformViewer.jsx
import React from "react";
import RenderJotform from "./RenderJotform";
import reactForm from "../../assets/testing with properties.json" // ✅ your saved form JSON

export function JotformViewer({ onBack }) {
  // For now, we only have react.json → later you can map different .jsons
  const formData = reactForm;

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
