import React, { useState, useEffect } from "react";
import { Loader, Text, Box, Divider, Image, Group, Button } from "@mantine/core";
import axios from "axios";

// Helper component to render a single element. It's kept inside the same file.
function RenderElement({ element }) {
  const { content, tagName, align, width, height, required, style = {}, placeholder } = element;

  const baseStyle = {
    textAlign: align || "left",
    width: width || "auto",
    height: height || "auto",
    ...style,
  };

  switch (tagName) {
    case "heading":
      return (
        <Text fw={700} size={element.size || "xl"} mb="md" style={baseStyle}>
          {content}
          {required && <span style={{ color: "red" }}> *</span>}
        </Text>
      );
    case "paragraph":
      return (
        <Text size={element.size || "md"} mb="md" style={{ ...baseStyle, lineHeight: 1.6 }}>
          {content}
        </Text>
      );
    case "image":
      return (
        <Box mb="md" style={baseStyle}>
          <Image
            src={typeof content === "string" ? content : content.fileUrl}
            alt={element.elementName || placeholder || "Image"}
            width={width || undefined}
            height={height || undefined}
            fit="contain"
          />
          {typeof content === "object" && (
            <Text size="xs" mt={4} c="dimmed">{content.fileName}</Text>
          )}
        </Box>
      );
    case "video":
      return (
        <Box mb="md" style={baseStyle}>
          <video width={width || "100%"} height={height || "auto"} controls>
            <source src={content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    case "audio":
        return (
          <Box mb="md" style={baseStyle}>
            <audio controls>
              <source src={content} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
    case "horizontalline":
    case "breakline":
      return <Divider my="md" style={baseStyle} />;
    case "orderedlist":
      return (
        <ol style={baseStyle}>
          {content.split(",").map((item, idx) => (<li key={idx}>{item.trim()}</li>))}
        </ol>
      );
    case "unorderedlist":
      return (
        <ul style={baseStyle}>
          {content.split(",").map((item, idx) => (<li key={idx}>{item.trim()}</li>))}
        </ul>
      );
    default:
      return (<Text style={baseStyle}>{content}</Text>);
  }
}

// The main, combined component
export function JotformViewer({ jotformName, onBack }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0); // State for pagination

  useEffect(() => {
    if (!jotformName) {
      setLoading(false);
      setError("No Jotform name provided.");
      return;
    }

    const fetchJotform = async () => {
      setLoading(true);
      setError(null);
      setPageIndex(0); // Reset to first page on new form load
      try {
        const response = await axios.get(`http://localhost:8081/api/jotforms`);
        const foundForm = response.data.find(form => form.jotformName === jotformName);
        
        if (foundForm) {
            setFormData(foundForm);
        } else {
            setError(`Jotform with name "${jotformName}" not found.`);
        }
      } catch (err) {
        setError("Failed to load the form. Please check the network connection.");
        console.error("Fetch Jotform Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJotform();
  }, [jotformName]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box ta="center" mt="xl">
          <Loader />
          <Text mt="md">Loading Form...</Text>
        </Box>
      );
    }

    if (error) {
      return <Text color="red" ta="center">{error}</Text>;
    }

    if (formData) {
      const page = formData.pages[pageIndex];
      return (
        <Box style={{ maxWidth: 800, margin: "0 auto", padding: "40px", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Text fw={800} size="xl" ta="center" mb="xl">
            {formData.jotformName}
          </Text>

          {page.elements
            .sort((a, b) => a.sequence - b.sequence)
            .map((element) => <RenderElement key={element.id} element={element} />)
          }

          <Group justify="center" mt="xl">
            <Button disabled={pageIndex === 0} onClick={() => setPageIndex(i => i - 1)}>
              Back
            </Button>
            <Button disabled={pageIndex === formData.totalPages - 1} onClick={() => setPageIndex(i => i + 1)}>
              Next
            </Button>
          </Group>
        </Box>
      );
    }
    
    return null; // Return null if no condition is met
  };

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
      
      {renderContent()}
    </Box>
  );
}
