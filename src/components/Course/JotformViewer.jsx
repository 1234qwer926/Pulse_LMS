import React, { useState, useEffect } from "react";
import { Loader, Text, Box } from "@mantine/core";
import axios from "axios";
// The import statement now exactly matches the file name "RenderJotForm.jsx"
import RenderJotform from "./RenderJotForm.jsx";

export function JotformViewer({ jotformName, onBack }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Exit early if no jotformName is provided
    if (!jotformName) {
      setLoading(false);
      setError("No Jotform name provided.");
      return;
    }

    const fetchJotform = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetches all forms, then finds the correct one by name.
        // For better performance, consider creating a specific backend endpoint
        // like GET /api/jotforms/by-name/{jotformName}
        const response = await axios.get(`http://localhost:8081/api/jotforms`);
        const foundForm = response.data.find(form => form.jotformName === jotformName);
        
        if (foundForm) {
            setFormData(foundForm);
        } else {
            setError(`Jotform with name "${jotformName}" not found.`);
        }

      } catch (err) {
        setError("Failed to load the form. Please check the network connection and try again.");
        console.error("Fetch Jotform Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJotform();
  }, [jotformName]); // This effect runs whenever the jotformName changes

  return (
    <Box p="xl">
      <button
        onClick={onBack}
        style={{
          background: "#333",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Courses
      </button>

      {/* Display loading indicator */}
      {loading && (
        <Box ta="center" mt="xl">
          <Loader />
          <Text mt="md">Loading Form...</Text>
        </Box>
      )}

      {/* Display error message if something went wrong */}
      {error && <Text color="red" ta="center">{error}</Text>}

      {/* Render the form if data is available and not loading */}
      {formData && !loading && <RenderJotform formData={formData} />}
    </Box>
  );
}
