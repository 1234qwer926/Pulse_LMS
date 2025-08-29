import React, { useState } from "react";
import { Box, Text, Divider, Image, Group, Button } from "@mantine/core";

// This is a helper component to render a single element based on its tagName
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
          {content.split(",").map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
        </ol>
      );

    case "unorderedlist":
      return (
        <ul style={baseStyle}>
          {content.split(",").map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
        </ul>
      );

    default:
      return (
        <Text style={baseStyle}>{content}</Text>
      );
  }
}

// The main component that renders the entire form with pagination
export default function RenderJotform({ formData }) {
  const [pageIndex, setPageIndex] = useState(0);
  const page = formData.pages[pageIndex];

  return (
    <Box
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Text fw={800} size="xl" ta="center" mb="xl">
        {formData.jotformName}
      </Text>

      {/* Render all elements on the current page, sorted by sequence */}
      {page.elements
        .sort((a, b) => a.sequence - b.sequence)
        .map((element) => (
          <RenderElement key={element.id} element={element} />
        ))}

      {/* Page navigation buttons */}
      <Group justify="center" mt="xl">
        <Button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((i) => i - 1)}
        >
          Back
        </Button>
        <Button
          disabled={pageIndex === formData.totalPages - 1}
          onClick={() => setPageIndex((i) => i + 1)}
        >
          Next
        </Button>
      </Group>
    </Box>
  );
}
