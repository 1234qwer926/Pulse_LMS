// CreateJotformBuilder.jsx
import React, { useState } from 'react';
import { Paper, Box, Button, TextInput, Group, Text, Divider, ThemeIcon } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconTypography, IconTextSize, IconArrowsVertical, IconLineDashed, IconMusic, IconVideo, IconClock, IconListNumbers, IconList } from '@tabler/icons-react';

const FORM_ELEMENTS = [
  { type: 'heading', label: 'Heading', icon: IconTypography },
  { type: 'paragraph', label: 'Paragraph', icon: IconTextSize },
  { type: 'breakline', label: 'Break Line', icon: IconArrowsVertical },
  { type: 'horizontalline', label: 'Horizontal Line', icon: IconLineDashed },
  { type: 'audio', label: 'Audio', icon: IconMusic },
  { type: 'video', label: 'Video', icon: IconVideo },
  { type: 'timer', label: 'Timer', icon: IconClock },
  { type: 'orderedlist', label: 'Ordered List', icon: IconListNumbers },
  { type: 'unorderedlist', label: 'Unordered List', icon: IconList },
];

function getElementComponent(element, onEdit) {
  switch (element.type) {
    case 'heading':
      return (
        <Text
          fw={700}
          size="xl"
          style={{ cursor: 'pointer', marginBottom: 8 }}
          onClick={onEdit}
        >{element.content || 'Tap to Edit Heading'}</Text>
      );
    case 'paragraph':
      return (
        <Text
          style={{ cursor: 'pointer', color: '#555', marginBottom: 8 }}
          onClick={onEdit}
        >{element.content || 'Tap to Edit Paragraph'}</Text>
      );
    case 'breakline':
      return <br />;
    case 'horizontalline':
      return <Divider my="xs" />;
    case 'audio':
      return <Box style={{ color: '#666', fontSize: 14 }}>[Audio Placeholder]</Box>;
    case 'video':
      return <Box style={{ color: '#666', fontSize: 14 }}>[Video Placeholder]</Box>;
    case 'timer':
      return <Box style={{ color: '#666', fontSize: 14 }}>[Timer Placeholder]</Box>;
    case 'orderedlist':
      return (
        <ol style={{ color: '#666', marginBottom: 8 }}>
          <li>Tap to Edit Item 1</li>
          <li>Tap to Edit Item 2</li>
        </ol>
      );
    case 'unorderedlist':
      return (
        <ul style={{ color: '#666', marginBottom: 8 }}>
          <li>Tap to Edit Item 1</li>
          <li>Tap to Edit Item 2</li>
        </ul>
      );
    default:
      return <span />;
  }
}

export function CreateJotformBuilder({ jotformName = "New Jotform" }) {
  const [pages, setPages] = useState([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'elements' && destination.droppableId === 'canvas') {
      const newElem = { ...FORM_ELEMENTS[source.index], content: '' };
      const updated = Array.from(pages);
      updated[currentPage] = [
        ...updated[currentPage].slice(0, destination.index),
        newElem,
        ...updated[currentPage].slice(destination.index),
      ];
      setPages(updated);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const current = Array.from(pages[currentPage]);
      const [moved] = current.splice(source.index, 1);
      current.splice(destination.index, 0, moved);
      const updated = Array.from(pages);
      updated[currentPage] = current;
      setPages(updated);
    }
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditingValue(pages[currentPage][idx]?.content || '');
  };

  const handleEditSave = (idx) => {
    const updatedPages = [...pages];
    updatedPages[currentPage][idx] = {
      ...updatedPages[currentPage][idx],
      content: editingValue,
    };
    setPages(updatedPages);
    setEditIndex(null);
    setEditingValue('');
  };

  const addPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length);
  };

  return (
    <Paper style={{ display: 'flex', minHeight: 600, maxWidth: 950, margin: '40px auto', borderRadius: 18, overflow: 'hidden', boxShadow: '0 12px 34px 0 rgba(0,0,0,0.11)' }} withBorder p={0}>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Sidebar */}
        <Box style={{
          width: 220,
          background: '#191b1f',
          color: '#eee',
          borderRight: '1px solid #232428',
          padding: '28px 10px 15px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Text fw={800} size="md" style={{ letterSpacing: 0.5, marginBottom: 8, color: '#44bbff' }}>Form Elements</Text>
          <Divider mb="md" color="#272933" />
          <Droppable droppableId="elements" isDropDisabled>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%' }}>
                {FORM_ELEMENTS.map((item, idx) => (
                  <Draggable key={item.type} draggableId={item.type} index={idx}>
                    {providedDraggable => (
                      <Group
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        style={{
                          background: '#232428',
                          borderRadius: 24,
                          boxShadow: '0 2px 8px 0 rgba(20,20,30,0.05)',
                          padding: '9px 15px',
                          marginBottom: 16,
                          fontWeight: 500,
                          color: '#cfe9fa',
                          fontSize: 15,
                          cursor: 'grab',
                          alignItems: 'center',
                          ...providedDraggable.draggableProps.style,
                        }}
                        spacing={8}
                      >
                        <ThemeIcon variant="light" color="blue" size={28}>
                          <item.icon size={18} />
                        </ThemeIcon>
                        {item.label}
                      </Group>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
        {/* Canvas Area */}
        <Box style={{
          flex: 1,
          minWidth: 0,
          minHeight: 600,
          background: "#f9fbfd",
          padding: 28,
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Jotform Name */}
          <Text fw={800} size="xl" align="center" mb="xl" style={{ color: '#2988f4', letterSpacing: 1 }}>
            {jotformName}
          </Text>
          {/* Canvas (Drag Area) */}
          <Droppable droppableId="canvas">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}
                style={{
                  minHeight: 320,
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: '0 0 0 1px #eaedf5',
                  padding: "22px 18px",
                  marginBottom: 20,
                  transition: 'box-shadow 0.12s'
                }}>
                {(pages[currentPage] || []).length === 0 && (
                  <Text align="center" color="gray">
                    Drag form elements here...
                  </Text>
                )}
                {(pages[currentPage] || []).map((element, idx) => (
                  <Draggable key={idx + element.type} draggableId={`canvas-element-${idx}`} index={idx}>
                    {providedDraggable => (
                      <Box
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        style={{
                          background: '#f5f7fa',
                          borderRadius: 10,
                          padding: 16,
                          marginBottom: 16,
                          border: '1px solid #e0e6f1',
                          color: '#2c3a58',
                          ...providedDraggable.draggableProps.style,
                        }}
                      >
                        {/* Edit on click */}
                        {editIndex === idx ? (
                          <Group>
                            <TextInput
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              style={{ flex: 1 }}
                              size="md"
                            />
                            <Button size="xs" variant="subtle" color="blue" onClick={() => handleEditSave(idx)}>Save</Button>
                          </Group>
                        ) : (
                          <span onClick={() => handleEdit(idx)}>
                            {getElementComponent(element, () => handleEdit(idx))}
                          </span>
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Page Controls */}
          <Group mt="xs" position="apart" grow>
            <Button size="xs" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous Page
            </Button>
            <Text size="sm" color="gray">
              Page {currentPage + 1} of {pages.length}
            </Text>
            <Button size="xs" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} onClick={addPage}>
              Add Next Page
            </Button>
          </Group>
        </Box>
      </DragDropContext>
    </Paper>
  );
}
