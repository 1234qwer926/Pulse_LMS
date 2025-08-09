// CreateJotformBuilder.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Box, Button, TextInput, Group, Text, Divider, ThemeIcon, Stack, Select, NumberInput, Tooltip, ActionIcon, Textarea, FileInput, ScrollArea } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconTypography, IconTextSize, IconArrowsVertical, IconLineDashed, IconMusic, IconVideo, IconClock, IconListNumbers, IconList, IconSettings, IconEye, IconTrash, IconUpload, IconPhoto } from '@tabler/icons-react';

const FORM_ELEMENTS = [
  { type: 'heading', label: 'Heading', icon: IconTypography },
  { type: 'paragraph', label: 'Paragraph', icon: IconTextSize },
  { type: 'image', label: 'Image', icon: IconPhoto },
  { type: 'breakline', label: 'Break Line', icon: IconArrowsVertical },
  { type: 'horizontalline', label: 'Horizontal Line', icon: IconLineDashed },
  { type: 'audio', label: 'Audio', icon: IconMusic },
  { type: 'video', label: 'Video', icon: IconVideo },
  { type: 'timer', label: 'Timer', icon: IconClock },
  { type: 'orderedlist', label: 'Ordered List', icon: IconListNumbers },
  { type: 'unorderedlist', label: 'Unordered List', icon: IconList },
];

function Timer({ element, onTimeUpdate }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => {
          const newTime = time + 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box style={{ 
      textAlign: element.align || 'left',
      padding: 8,
    }}>
      <Text fw={600} size="md" mb={4}>Page Timer</Text>
      <Text size="lg" fw={700} style={{ fontFamily: 'monospace' }}>
        {formatTime(time)}
      </Text>
      <Text size="xs" color="dimmed" mt={4}>
        Time spent on this page
      </Text>
    </Box>
  );
}

function getElementComponent(element, onEdit, isSelected, onDelete, onShowProperties, index) {
  const baseStyle = {
    cursor: 'pointer',
    position: 'relative',
    marginBottom: 16,
    // Clean styling - no borders or backgrounds by default
  };

  const ElementWrapper = ({ children }) => (
    <Box 
      style={{
        ...baseStyle,
        outline: isSelected ? '2px solid #2988f4' : 'none',
        outlineOffset: 2,
      }} 
      onMouseEnter={(e) => {
        if (!isSelected) {
          const actionsDiv = e.currentTarget.querySelector('.element-actions');
          if (actionsDiv) actionsDiv.style.display = 'block';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          const actionsDiv = e.currentTarget.querySelector('.element-actions');
          if (actionsDiv) actionsDiv.style.display = 'none';
        }
      }}
    >
      {children}
      {/* Action buttons */}
      <Box
        className="element-actions"
        style={{
          position: 'absolute',
          top: -10,
          right: -10,
          display: isSelected ? 'block' : 'none',
          background: 'rgba(0,0,0,0.8)',
          borderRadius: 6,
          padding: 4,
          zIndex: 10,
        }}
      >
        <Group spacing={4}>
          <Tooltip label="Properties" position="top">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="white"
              onClick={(e) => {
                e.stopPropagation();
                onShowProperties();
              }}
            >
              <IconSettings size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" position="top">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
    </Box>
  );

  switch (element.type) {
    case 'heading':
      return (
        <ElementWrapper>
          <Text
            fw={700}
            size={element.size || "xl"}
            style={{ 
              textAlign: element.align || 'left',
              color: '#000',
              marginBottom: 8,
            }}
            onClick={onEdit}
          >{element.content || 'Tap to Edit Heading'}</Text>
        </ElementWrapper>
      );
    case 'paragraph':
      return (
        <ElementWrapper>
          <Text
            style={{ 
              color: '#333', 
              textAlign: element.align || 'left',
              lineHeight: 1.6,
              marginBottom: 8,
            }}
            onClick={onEdit}
          >{element.content || 'Tap to Edit Paragraph'}</Text>
        </ElementWrapper>
      );
    case 'image':
      return (
        <ElementWrapper>
          <Box style={{ 
            textAlign: element.align || 'left'
          }} onClick={onEdit}>
            {element.fileName ? (
              <img 
                src={element.fileUrl} 
                alt={element.fileName}
                style={{ 
                  maxWidth: element.width ? `${element.width}px` : '100%',
                  height: element.height ? `${element.height}px` : 'auto',
                }}
              />
            ) : (
              <Box style={{ 
                width: element.width ? `${element.width}px` : '300px',
                height: element.height ? `${element.height}px` : '200px',
                border: '2px dashed #ddd',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <IconPhoto size={40} color="#ccc" />
                  <Text color="dimmed" size="sm">Click to upload image</Text>
                </div>
              </Box>
            )}
          </Box>
        </ElementWrapper>
      );
    case 'breakline':
      return (
        <ElementWrapper>
          <br />
        </ElementWrapper>
      );
    case 'horizontalline':
      return (
        <ElementWrapper>
          <Divider color="#ddd" />
        </ElementWrapper>
      );
    case 'audio':
      return (
        <ElementWrapper>
          <Box style={{ 
            textAlign: element.align || 'left'
          }} onClick={onEdit}>
            {element.fileName ? (
              <div>
                <Text size="sm" fw={500} mb={8}>Audio: {element.fileName}</Text>
                <audio 
                  controls 
                  style={{ 
                    width: element.width ? `${element.width}px` : '100%',
                    height: element.height ? `${element.height}px` : 'auto',
                  }}
                >
                  <source src={element.fileUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <Box style={{
                width: element.width ? `${element.width}px` : '300px',
                height: element.height ? `${element.height}px` : '60px',
                border: '1px dashed #ddd',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
              }}>
                <Text color="dimmed" size="sm">[Audio - Upload audio file]</Text>
              </Box>
            )}
          </Box>
        </ElementWrapper>
      );
    case 'video':
      return (
        <ElementWrapper>
          <Box style={{ 
            textAlign: element.align || 'left'
          }} onClick={onEdit}>
            {element.fileName ? (
              <div>
                <Text size="sm" fw={500} mb={8}>Video: {element.fileName}</Text>
                <video 
                  controls 
                  style={{ 
                    width: element.width ? `${element.width}px` : '400px',
                    height: element.height ? `${element.height}px` : 'auto',
                  }}
                >
                  <source src={element.fileUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            ) : (
              <Box style={{
                width: element.width ? `${element.width}px` : '400px',
                height: element.height ? `${element.height}px` : '250px',
                border: '1px dashed #ddd',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
              }}>
                <Text color="dimmed" size="sm">[Video - Upload video file]</Text>
              </Box>
            )}
          </Box>
        </ElementWrapper>
      );
    case 'timer':
      return (
        <ElementWrapper>
          <Timer element={element} onTimeUpdate={(time) => console.log('Time spent:', time)} />
        </ElementWrapper>
      );
    case 'orderedlist':
      return (
        <ElementWrapper>
          <ol style={{ 
            color: '#333', 
            textAlign: element.align || 'left',
            marginBottom: 8,
            paddingLeft: 20,
          }} onClick={onEdit}>
            {element.listItems ? (
              element.listItems.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
              ))
            ) : (
              <>
                <li style={{ marginBottom: 4 }}>Tap to Edit Item 1</li>
                <li style={{ marginBottom: 4 }}>Tap to Edit Item 2</li>
              </>
            )}
          </ol>
        </ElementWrapper>
      );
    case 'unorderedlist':
      return (
        <ElementWrapper>
          <ul style={{ 
            color: '#333', 
            textAlign: element.align || 'left',
            marginBottom: 8,
            paddingLeft: 20,
          }} onClick={onEdit}>
            {element.listItems ? (
              element.listItems.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
              ))
            ) : (
              <>
                <li style={{ marginBottom: 4 }}>Tap to Edit Item 1</li>
                <li style={{ marginBottom: 4 }}>Tap to Edit Item 2</li>
              </>
            )}
          </ul>
        </ElementWrapper>
      );
    default:
      return <span />;
  }
}

function PropertiesPanel({ selectedElement, onPropertyChange, onClose }) {
  const [listItemsText, setListItemsText] = useState('');

  React.useEffect(() => {
    if (selectedElement?.listItems) {
      setListItemsText(selectedElement.listItems.join('\n'));
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <Box style={{ width: 300, background: '#2c2c2c', color: '#fff', padding: 20, height: '100%' }}>
        <Text size="lg" fw={600} mb="md">Properties</Text>
        <Text color="dimmed">Select an element to edit its properties</Text>
      </Box>
    );
  }

  const handleFileUpload = (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onPropertyChange('fileName', file.name);
      onPropertyChange('fileUrl', fileUrl);
    }
  };

  const handleListItemsChange = (value) => {
    setListItemsText(value);
    const items = value.split('\n').filter(item => item.trim() !== '');
    onPropertyChange('listItems', items);
  };

  const getPropertiesTitle = () => {
    switch (selectedElement.type) {
      case 'heading': return 'Heading Properties';
      case 'paragraph': return 'Paragraph Properties';
      case 'image': return 'Image Properties';
      case 'audio': return 'Audio Properties';
      case 'video': return 'Video Properties';
      case 'timer': return 'Timer Properties';
      case 'orderedlist': return 'Ordered List Properties';
      case 'unorderedlist': return 'Unordered List Properties';
      default: return 'Element Properties';
    }
  };

  return (
    <Box style={{ width: 300, background: '#2c2c2c', color: '#fff', height: '100%' }}>
      <ScrollArea style={{ height: '100%' }}>
        <Box style={{ padding: 20 }}>
          <Group justify="space-between" mb="md">
            <Text size="lg" fw={600}>{getPropertiesTitle()}</Text>
            <Button size="xs" variant="subtle" onClick={onClose}>×</Button>
          </Group>
          
          <Stack spacing="md">
            {/* Content/Text editing for heading */}
            {(['heading'].includes(selectedElement.type)) && (
              <Box>
                <Text size="sm" mb={4}>Content</Text>
                <TextInput
                  value={selectedElement.content || ''}
                  onChange={(e) => onPropertyChange('content', e.target.value)}
                  placeholder="Enter heading text"
                />
              </Box>
            )}

            {/* Content/Text editing for paragraph */}
            {(['paragraph'].includes(selectedElement.type)) && (
              <Box>
                <Text size="sm" mb={4}>Content</Text>
                <Textarea
                  value={selectedElement.content || ''}
                  onChange={(e) => onPropertyChange('content', e.target.value)}
                  placeholder="Enter paragraph text"
                  rows={6}
                />
              </Box>
            )}

            {/* List items editing */}
            {(['orderedlist', 'unorderedlist'].includes(selectedElement.type)) && (
              <Box>
                <Text size="sm" mb={4}>List Items (one per line)</Text>
                <Textarea
                  value={listItemsText}
                  onChange={(e) => handleListItemsChange(e.target.value)}
                  placeholder="Enter list items, one per line"
                  rows={4}
                />
              </Box>
            )}

            {/* File upload for image/audio/video */}
            {(['image', 'audio', 'video'].includes(selectedElement.type)) && (
              <Box>
                <Text size="sm" mb={4}>
                  {selectedElement.type === 'image' ? 'Image File' : 
                   selectedElement.type === 'audio' ? 'Audio File' : 'Video File'}
                </Text>
                <FileInput
                  placeholder={`Choose ${selectedElement.type} file`}
                  accept={
                    selectedElement.type === 'image' ? 'image/*' : 
                    selectedElement.type === 'audio' ? 'audio/*' : 'video/*'
                  }
                  onChange={handleFileUpload}
                  leftSection={<IconUpload size={14} />}
                />
                {selectedElement.fileName && (
                  <Text size="xs" color="green" mt={4}>
                    Current file: {selectedElement.fileName}
                  </Text>
                )}
              </Box>
            )}

            {/* Size properties for media elements */}
            {(['image', 'audio', 'video'].includes(selectedElement.type)) && (
              <Box>
                <Text size="sm" mb={4}>Size</Text>
                <Group>
                  <NumberInput
                    placeholder="300"
                    value={selectedElement.width || ''}
                    onChange={(value) => onPropertyChange('width', value)}
                    size="xs"
                    style={{ width: 80 }}
                  />
                  <Text size="xs">PX</Text>
                  <NumberInput
                    placeholder="200"
                    value={selectedElement.height || ''}
                    onChange={(value) => onPropertyChange('height', value)}
                    size="xs"
                    style={{ width: 80 }}
                  />
                  <Text size="xs">PX</Text>
                </Group>
                <Group mt={4}>
                  <Text size="xs" color="dimmed">Width</Text>
                  <Text size="xs" color="dimmed" ml="auto">Height</Text>
                </Group>
              </Box>
            )}

            {/* Size options for heading */}
            {selectedElement.type === 'heading' && (
              <Box>
                <Text size="sm" mb={4}>Size</Text>
                <Select
                  value={selectedElement.size || 'xl'}
                  onChange={(value) => onPropertyChange('size', value)}
                  data={[
                    { value: 'xs', label: 'Extra Small' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' },
                  ]}
                />
              </Box>
            )}
            
            {/* Alignment for applicable elements */}
            {!['breakline', 'horizontalline'].includes(selectedElement.type) && (
              <Box>
                <Text size="sm" mb={4}>Alignment</Text>
                <Group>
                  <Button 
                    size="xs" 
                    variant={selectedElement.align === 'left' ? 'filled' : 'subtle'}
                    onClick={() => onPropertyChange('align', 'left')}
                  >
                    LEFT
                  </Button>
                  <Button 
                    size="xs" 
                    variant={selectedElement.align === 'center' ? 'filled' : 'subtle'}
                    onClick={() => onPropertyChange('align', 'center')}
                  >
                    CENTER
                  </Button>
                  <Button 
                    size="xs" 
                    variant={selectedElement.align === 'right' ? 'filled' : 'subtle'}
                    onClick={() => onPropertyChange('align', 'right')}
                  >
                    RIGHT
                  </Button>
                </Group>
                <Text size="xs" color="dimmed" mt={4}>Select how the content is aligned horizontally</Text>
              </Box>
            )}
            
            <Box>
              <Text size="sm" mb={4}>Duplicate Field</Text>
              <Button variant="light" size="sm">
                DUPLICATE
              </Button>
              <Text size="xs" color="dimmed" mt={4}>Duplicate this field with all saved settings</Text>
            </Box>
          </Stack>
        </Box>
      </ScrollArea>
    </Box>
  );
}

export function CreateJotformBuilder({ jotformName = "New Jotform" }) {
  const [pages, setPages] = useState([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    
    if (source.droppableId === 'elements' && destination.droppableId === 'canvas') {
      const newElem = { ...FORM_ELEMENTS[source.index], content: '', id: Date.now() };
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

  const handleElementSelect = (idx) => {
    setSelectedElementIndex(idx);
    setShowProperties(true);
  };

  const handleElementDelete = (idx) => {
    const updated = Array.from(pages);
    updated[currentPage].splice(idx, 1);
    setPages(updated);
    setSelectedElementIndex(null);
    setShowProperties(false);
  };

  const handlePropertyChange = (property, value) => {
    if (selectedElementIndex === null) return;
    
    const updatedPages = [...pages];
    updatedPages[currentPage][selectedElementIndex] = {
      ...updatedPages[currentPage][selectedElementIndex],
      [property]: value,
    };
    setPages(updatedPages);
  };

  const addPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length);
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted!', pages);
    // Handle form submission
  };

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
      {/* Top Navigation */}
      <Box style={{ background: '#ff6b35', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Group>
          <Button size="sm" variant="white" leftSection={<IconEye size={16} />} onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </Group>
        
        <Group>
          <Text size="sm" style={{ color: 'white', fontWeight: 600 }}>
            Page {currentPage + 1} of {pages.length}
          </Text>
          <Button size="sm" variant="white" onClick={addPage}>
            + Add Page
          </Button>
        </Group>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1, display: 'flex' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Left Sidebar - Form Elements */}
          {!isPreview && (
            <Box style={{
              width: 200,
              background: '#2c2c2c',
              color: '#fff',
              padding: 16,
              borderRight: '1px solid #444'
            }}>
              <Text fw={700} size="sm" mb="md" style={{ color: '#ff6b35' }}>FORM ELEMENTS</Text>
              
              <Droppable droppableId="elements" isDropDisabled>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {FORM_ELEMENTS.map((item, idx) => (
                      <Draggable key={item.type} draggableId={item.type} index={idx}>
                        {providedDraggable => (
                          <Group
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={{
                              background: '#3c3c3c',
                              borderRadius: 8,
                              padding: '8px 12px',
                              marginBottom: 8,
                              cursor: 'grab',
                              fontSize: 13,
                              ...providedDraggable.draggableProps.style,
                            }}
                            spacing={8}
                          >
                            <item.icon size={16} />
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
          )}

          {/* Canvas Area - Word-like document */}
          <Box style={{
            flex: 1,
            background: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            padding: 20,
          }}>
            <Box style={{
              width: '100%',
              maxWidth: 800,
              background: '#fff',
              minHeight: 'calc(100vh - 120px)',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <ScrollArea style={{ height: 'calc(100vh - 120px)' }}>
                <Box style={{ padding: '40px 60px' }}>
                  {/* Form Title */}
                  <Text fw={700} size="xl" align="center" mb="xl" style={{ color: '#333' }}>
                    {jotformName}
                  </Text>

                  {/* Form Canvas */}
                  {!isPreview ? (
                    <Droppable droppableId="canvas">
                      {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 400 }}>
                          {(pages[currentPage] || []).length === 0 && (
                            <Text align="center" color="gray" style={{ padding: 40 }}>
                              Drag your first question here from the left
                            </Text>
                          )}
                          
                          {(pages[currentPage] || []).map((element, idx) => (
                            <Draggable key={`${element.id || idx}-${element.type}`} draggableId={`canvas-element-${idx}`} index={idx}>
                              {providedDraggable => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  style={{
                                    ...providedDraggable.draggableProps.style,
                                  }}
                                >
                                  {getElementComponent(
                                    element, 
                                    () => handleElementSelect(idx),
                                    selectedElementIndex === idx,
                                    () => handleElementDelete(idx),
                                    () => handleElementSelect(idx),
                                    idx
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    // Preview Mode
                    <div>
                      {(pages[currentPage] || []).map((element, idx) => (
                        <Box key={idx} mb="md">
                          {getElementComponent(element, () => {}, false, () => {}, () => {}, idx)}
                        </Box>
                      ))}
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <Group justify="center" mt="xl" spacing="md" style={{ paddingTop: 40 }}>
                    {!isFirstPage && (
                      <Button 
                        size="md" 
                        variant="outline"
                        onClick={previousPage}
                      >
                        Back
                      </Button>
                    )}
                    
                    {!isLastPage ? (
                      <Button 
                        size="md" 
                        style={{ background: '#007CFF' }}
                        onClick={nextPage}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        size="md" 
                        style={{ background: '#00C851' }}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    )}
                  </Group>
                </Box>
              </ScrollArea>
            </Box>
          </Box>

          {/* Right Properties Panel */}
          {!isPreview && showProperties && (
            <PropertiesPanel
              selectedElement={selectedElementIndex !== null ? pages[currentPage][selectedElementIndex] : null}
              onPropertyChange={handlePropertyChange}
              onClose={() => setShowProperties(false)}
            />
          )}
        </DragDropContext>
      </Box>
    </Box>
  );
}
