import React, { useState, useEffect } from "react";
import { Loader, Text, Box } from "@mantine/core";
import axios from "axios";
import RenderJotform from "./RenderJotform";

export function JotformViewer({ jotformName, onBack }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jotformName) return;

    const fetchJotform = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming your backend can find a jotform by its name.
        // If not, you may need an endpoint like /api/jotforms/name/{name}
        const response = await axios.get(`http://localhost:8081/api/jotforms`);
        const foundForm = response.data.find(form => form.jotformName === jotformName);
        
        if (foundForm) {
            setFormData(foundForm);
        } else {
            setError(`Jotform with name "${jotformName}" not found.`);
        }

      } catch (err) {
        setError("Failed to load the form. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJotform();
  }, [jotformName]);

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

      {loading && (
        <Box ta="center">
          <Loader />
          <Text>Loading Form...</Text>
        </Box>
      )}

      {error && <Text color="red" ta="center">{error}</Text>}

      {formData && !loading && <RenderJotform formData={formData} />}
    </Box>
  );
}
