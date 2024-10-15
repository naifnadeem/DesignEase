import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Image, Text, Transformer, Rect, Group, Line } from 'react-konva';
import { Button, Form, InputGroup, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Text as TextIcon, Layers, Grid, AlignCenter, AlignLeft, AlignRight, Group as GroupIcon, Trash2, Download, Save  } from 'lucide-react';
import { FaFont, FaPalette, FaBold, FaItalic, FaUndo, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
import Tesseract from 'tesseract.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./Navbar";


const Editor = () => {
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // Define selectedId as a state variable
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef();
  const [stageSize] = useState({ width: 800, height: 600 });
  const [svgContent, setSvgContent] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const gridSize = 20; // Size of grid cells

  // New state for layers
  const [layers, setLayers] = useState([{ id: 'default', name: 'Layer 1', visible: true }]);
  const [activeLayer, setActiveLayer] = useState('default');

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImage");
    if (storedImage) {
      fetch(`${import.meta.env.VITE_API_URL}/uploads/images/${storedImage}`)
        .then((response) => response.text())
        .then((data) => {
          setSvgContent(data);
          localStorage.removeItem("selectedImage");
        })
        .catch((error) => console.error("Error fetching SVG:", error));
    }
  }, []);
  useEffect(() => {
    if (selectedId) {
      const selectedElement = elements.find(el => el.id === selectedId);
      if (selectedElement && selectedElement.type === 'text' && selectedElement.x === stageSize.width / 2 && selectedElement.y === stageSize.height / 2) {
        const node = stageRef.current.findOne(`#${selectedId}`);
        if (node) {
          const width = node.width();
          const height = node.height();
          setElements(prev => prev.map(el => 
            el.id === selectedId 
              ? { ...el, x: stageSize.width / 2 - width / 2, y: stageSize.height / 2 - height / 2 }
              : el
          ));
        }
      }
    }
  }, [selectedId, elements, stageSize]);

  useEffect(() => {
    if (svgContent) {
      const image = new window.Image();
      image.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
      image.onload = () => {
        const svgElement = {
          id: `svg${Date.now()}`,
          type: 'image',
          x: 0,
          y: 0,
          image: image,
          width: stageSize.width,
          height: stageSize.height,
          draggable: false,
          layerId: activeLayer,
        };
        setElements((prev) => [...prev, svgElement]);
      };
    }
  }, [svgContent, stageSize, activeLayer]);

  const checkDeselect = useCallback((e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedIds([]);
      setElements((prev) =>
        prev.map((el) => ({ ...el, draggable: false }))
      );
    }
  }, []);

  const addText = useCallback(() => {
    const newText = {
      id: `text${Date.now()}`,
      type: 'text',
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      text: 'New Text',
      fontSize: 20,
      fill: 'black',
      fontFamily: 'Arial',
      fontStyle: '',
      width: 100,
      height: 20,
      draggable: false,
      layerId: activeLayer,
    };
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) => [...prev, newText]);
    setSelectedIds([newText.id]);
    setSelectedId(newText.id); // Update selectedId state variable
  }, [stageSize, elements, activeLayer ]);

  const addImage = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        setHistory((prev) => [...prev, elements]);
        setRedoStack([]);
        setElements((prev) => [
          ...prev,
          {
            id: `image${Date.now()}`,
            type: 'image',
            x: 100,
            y: 100,
            image: img,
            width: img.width / 4,
            height: img.height / 4,
            draggable: false,
            layerId: activeLayer,
          },
        ]);
        recognizeTextInImage(img);
      };
    };
    reader.readAsDataURL(file);
  }, [elements, activeLayer]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((e) => {
    const id = e.target.id();
    let newX = e.target.x();
    let newY = e.target.y();

    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, x: newX, y: newY }
          : el
      )
    );
    setIsDragging(false);
  }, [elements, snapToGrid, gridSize]);

  const handleElementClick = useCallback((id, event) => {
    if (!isDragging) {
      const isMultiSelect = event.evt.shiftKey;
      if (isMultiSelect) {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
      } else {
        setSelectedIds([id]);
        setSelectedId(id); // Update selectedId state variable
      }
      setElements((prev) =>
        prev.map((el) => ({
          ...el,
          draggable: el.id === id || (isMultiSelect && selectedIds.includes(el.id))
        }))
      );
    }
  }, [isDragging, selectedIds]);

  const handleTextEdit = useCallback((id, newText) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, text: newText } : el
      )
    );
  }, [elements]);

  const handleColorChange = useCallback((id, newColor) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, fill: newColor } : el
      )
    );
  }, [elements]);

  const handleFontChange = useCallback((id, newFont) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, fontFamily: newFont } : el
      )
    );
  }, [elements]);

  const handleFontSizeChange = useCallback((id, newSize) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, fontSize: newSize } : el
      )
    );
  }, [elements]);

  const toggleBold = useCallback((id) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, fontStyle: el.fontStyle.includes('bold') ? el.fontStyle.replace('bold', '').trim() : `${el.fontStyle} bold`.trim() }
          : el
      )
    );
  }, [elements]);

  const toggleItalic = useCallback((id) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, fontStyle: el.fontStyle.includes('italic') ? el.fontStyle.replace('italic', '').trim() : `${el.fontStyle} italic`.trim() }
          : el
      )
    );
  }, [elements]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoStack((prev) => [elements, ...prev]);
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setElements(lastState);
    }
  }, [history, elements]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory((prev) => [...prev, elements]);
      setRedoStack((prev) => prev.slice(1));
      setElements(nextState);
    }
  }, [redoStack, elements]);

  const recognizeTextInImage = useCallback((img) => {
    Tesseract.recognize(
      img,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      const newTextElement = {
        id: `text${Date.now()}`,
        type: 'text',
        x: 100,
        y: 100,
        text: text,
        fontSize: 20,
        fill: 'black',
        fontFamily: 'Arial',
        fontStyle: '',
        width: 300,
        height: 50,
        draggable: false,
        layerId: activeLayer,
      };
      setElements((prev) => [...prev, newTextElement]);
      setSelectedIds([newTextElement.id]);
      setSelectedId(newTextElement.id); // Update selectedId state variable
    });
  }, [activeLayer]);

  const addLayer = useCallback(() => {
    const newLayer = {
      id: `layer${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayer(newLayer.id);
  }, [layers]);

  const toggleLayerVisibility = useCallback((layerId) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const moveLayer = useCallback((fromIndex, toIndex) => {
    setLayers((prev) => {
      const newLayers = [...prev];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      return newLayers;
    });
  }, []);

  const alignElements = useCallback((alignment) => {
    if (!selectedId) return;

    const selectedElement = elements.find((el) => el.id === selectedId);
    if (!selectedElement) return;

    let newX;
    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (stageSize.width - selectedElement.width) / 2;
        break;
      case 'right':
        newX = stageSize.width - selectedElement.width;
        break;
      default:
        return;
    }

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId ? { ...el, x: newX } : el
      )
    );
  }, [elements, selectedId, stageSize.width]);

  const selectedElement = elements.find(el => el.id === selectedId);

  const sidebarStyle = {
    backgroundColor: '#f8f9fa',
    height: '100vh',
    padding: '20px',
    overflowY: 'auto',
    position: 'sticky',
    top: 0,
  };

  const sidebarContentStyle = {
    maxHeight: 'calc(100vh - 40px)', // Subtract padding from viewport height
    overflowY: 'auto',
  };

  const groupElements = useCallback(() => {
    if (selectedIds.length < 2) return;
  
    const groupedElements = elements.filter((el) => selectedIds.includes(el.id));
    const groupBounds = {
      x: Math.min(...groupedElements.map((el) => el.x)),
      y: Math.min(...groupedElements.map((el) => el.y)),
      width: Math.max(...groupedElements.map((el) => el.x + el.width)) - Math.min(...groupedElements.map((el) => el.x)),
      height: Math.max(...groupedElements.map((el) => el.y + el.height)) - Math.min(...groupedElements.map((el) => el.y)),
    };
  
    const newGroup = {
      id: `group${Date.now()}`,
      type: 'group',
      x: groupBounds.x,
      y: groupBounds.y,
      width: groupBounds.width,
      height: groupBounds.height,
      draggable: false,
      layerId: activeLayer,
      children: groupedElements.map((el) => ({
        ...el,
        x: el.x - groupBounds.x,
        y: el.y - groupBounds.y,
      })),
    };
  
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) => [
      ...prev.filter((el) => !selectedIds.includes(el.id)),
      newGroup,
    ]);
    setSelectedIds([newGroup.id]);
    setSelectedId(newGroup.id); //Update selectedId state variable
  }, [elements, selectedIds, activeLayer]);
  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;

    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
    setSelectedId(null); // Reset selectedId state variable
  }, [elements, selectedIds]);

  const downloadCanvas = useCallback(() => {
    const dataURL = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const saveLogo = useCallback(async () => {
    console.log("Starting saveLogo function");
  
    // Temporarily hide selection and transformer
    const selectionRects = stageRef.current.find('Rect');
    const transformers = stageRef.current.find('Transformer');
    selectionRects.forEach(rect => rect.hide());
    transformers.forEach(transformer => transformer.hide());
  
    // Redraw the stage to apply the changes
    stageRef.current.batchDraw();
  
    // Capture the stage as an image
    const dataURL = stageRef.current.toDataURL();
  
    // Show selection and transformer again
    selectionRects.forEach(rect => rect.show());
    transformers.forEach(transformer => transformer.show());
    stageRef.current.batchDraw();
  
    const token = localStorage.getItem('token');
    
    console.log("Token from localStorage:", token ? "Present" : "Not found");
  
    if (!token) {
      console.error("No token found in localStorage");
      alert("Error: No authentication token found. Please log in again.");
      return;
    }
  
    // Retrieve and log all items in localStorage
    console.log("All localStorage items:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }
  
    const userString = localStorage.getItem('user');
    console.log("Raw user data from localStorage:", userString);
  
    let user;
    try {
      user = JSON.parse(userString);
      console.log("Parsed user data:", user);
    } catch (error) {
      console.error("Error parsing user data:", error);
      alert("Error: Unable to retrieve user data. Please log in again.");
      return;
    }
  
    if (!user || !user._id) {
      console.error("User data:", user);
      console.error("User ID not found in parsed data");
      alert("Error: User ID not found. Please log in again.");
      return;
    }
  
    // Prepare the data to be sent to the server
    const logoData = {
      name: "My Logo",
      image: dataURL,
      elements: elements,
      layers: layers,
      userId: user._id,
    };
  
    console.log("Logo data being sent:", logoData);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/saveLogo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(logoData),
      });
  
      console.log("Response status:", response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Logo saved successfully:', data);
        alert("Logo saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error saving logo:", response.status, errorData);
        alert(`Error saving logo: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      alert("Error saving logo: " + error.message);
    }
  }, [elements, layers]);
  return (
    <Container fluid>
           <Navbar userType="user" />

      <Row>
        <Col md={3} className="sidebar" style={sidebarStyle}>
          <div style={sidebarContentStyle}>
            <h3>Toolbar</h3>
            <Button variant="primary" className="mb-3 w-100" onClick={addText}>
              <TextIcon className="me-2" /> Add Text
            </Button>
            <Form.Control
              type="file"
              onChange={addImage}
              accept="image/*"
              className="mb-3"
            />
            <Button variant="secondary" className="me-2 mb-3" onClick={undo} disabled={history.length === 0}>
              <FaUndo />
            </Button>
            <Button variant="secondary" className="me-2 mb-3" onClick={redo} disabled={redoStack.length === 0}>
              <FaRedo />
            </Button>
            <Button variant="secondary" className="me-2 mb-3" onClick={groupElements} disabled={selectedIds.length < 2}>
              <GroupIcon />
            </Button>
            <Button variant="danger" className="me-2 mb-3" onClick={deleteSelected} disabled={selectedIds.length === 0}>
              <Trash2 />
            </Button>
            <Button variant="success" className="mb-3" onClick={downloadCanvas}>
              <Download />
            </Button>
            <Button variant="primary" className="mb-3" onClick={saveLogo}>
              <Save className="me-2" /> Save Logo
            </Button>
            <Form.Check
              type="switch"
              id="grid-switch"
              label="Show Grid"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="mb-2"
            />
            <Form.Check
              type="switch"
              id="snap-switch"
              label="Snap to Grid"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
              className="mb-3"
            />
            <Button variant="outline-secondary" className="me-2 mb-3" onClick={() => alignElements('left')}>
              <AlignLeft />
            </Button>
            <Button variant="outline-secondary" className="me-2 mb-3" onClick={() => alignElements('center')}>
              <AlignCenter />
            </Button>
            <Button variant="outline-secondary" className="mb-3" onClick={() => alignElements('right')}>
              <AlignRight />
            </Button>
            {selectedIds.length === 1 && elements.find((el) => el.id === selectedIds[0])?.type === 'text' && (
              <div>
                <h4>Edit Text</h4>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaFont />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={selectedElement.text}
                    onChange={(e) => handleTextEdit(selectedId, e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaPalette />
                  </InputGroup.Text>
                  <Form.Control
                    type="color"
                    value={selectedElement.fill}
                    onChange={(e) => handleColorChange(selectedId, e.target.value)}
                  />
                </InputGroup>
                <Form.Select
                  value={selectedElement.fontFamily}
                  onChange={(e) => handleFontChange(selectedId, e.target.value)}
                  className="mb-3"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                </Form.Select>
                <Form.Control
                  type="number"
                  min="10"
                  max="100"
                  value={selectedElement.fontSize}
                  onChange={(e) => handleFontSizeChange(selectedId, parseInt(e.target.value))}
                  className="mb-3"
                />
                <Button
                  variant="secondary"
                  className="me-2 mb-3"
                  onClick={() => toggleBold(selectedId)}
                >
                  <FaBold />
                </Button>
                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={() => toggleItalic(selectedId)}
                >
                  <FaItalic />
                </Button>
              </div>
            )}
            <h4>Layers</h4>
            <Button variant="primary" className="mb-3 w-100" onClick={addLayer}>
              <Layers className="me-2" /> Add Layer
            </Button>
            <ListGroup>
              {layers.map((layer, index) => (
                <ListGroup.Item key={layer.id} action active={layer.id === activeLayer} onClick={() => setActiveLayer(layer.id)}>
                  {layer.name}
                  <Button variant="link" onClick={() => toggleLayerVisibility(layer.id)}>
                    {layer.visible ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                  {index > 0 && (
                    <Button variant="link" onClick={() => moveLayer(index, index - 1)}>
                      ▲
                    </Button>
                  )}
                  {index < layers.length - 1 && (
                    <Button variant="link" onClick={() => moveLayer(index, index + 1)}>
                      ▼
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
        <Col md={9}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              ref={stageRef}
              style={{ border: '1px solid #ccc' }}
            >
              <Layer>
                <Rect
                  width={stageSize.width}
                  height={stageSize.height}
                  fill="white"
                />
                {showGrid && (
                  <Group>
                    {Array.from({ length: stageSize.width / gridSize }).map((_, i) => (
                      <Line
                        key={`v${i}`}
                        points={[i * gridSize, 0, i * gridSize, stageSize.height]}
                        stroke="#ddd"
                        strokeWidth={1}
                      />
                    ))}
                    {Array.from({ length: stageSize.height / gridSize }).map((_, i) => (
                      <Line
                        key={`h${i}`}
                        points={[0, i * gridSize, stageSize.width, i * gridSize]}
                        stroke="#ddd"
                        strokeWidth={1}
                      />
                    ))}
                  </Group>
                )}
                {layers.map((layer) => (
                  <Group key={layer.id}
                  visible={layer.visible}
                  >
                    {elements
                      .filter((element) => element.layerId === layer.id)
                      .map((element) => {
                        if (element.type === 'text') {
                          return (
                            <Text
                              key={element.id}
                              id={element.id}
                              text={element.text}
                              x={element.x}
                              y={element.y}
                              fontSize={element.fontSize}
                              fill={element.fill}
                              fontFamily={element.fontFamily}
                              fontStyle={element.fontStyle}
                              width={element.width}
                              height={element.height}
                              draggable={element.draggable}
                              onClick={(e) => handleElementClick(element.id, e)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                            />
                          );
                        } else if (element.type === 'image') {
                          return (
                            <Image
                              key={element.id}
                              id={element.id}
                              image={element.image}
                              x={element.x}
                              y={element.y}
                              width={element.width}
                              height={element.height}
                              draggable={element.draggable}
                              onClick={(e) => handleElementClick(element.id, e)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                            />
                          );
                        } else if (element.type === 'group') {
                          return (
                            <Group
                              key={element.id}
                              id={element.id}
                              x={element.x}
                              y={element.y}
                              width={element.width}
                              height={element.height}
                              draggable={element.draggable}
                              onClick={(e) => handleElementClick(element.id, e)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                            >
                              {element.children.map((child) => {
                                if (child.type === 'text') {
                                  return (
                                    <Text
                                      key={child.id}
                                      {...child}
                                    />
                                  );
                                } else if (child.type === 'image') {
                                  return (
                                    <Image
                                      key={child.id}
                                      {...child}
                                    />
                                  );
                                }
                                return null;
                              })}
                            </Group>
                          );
                        }
                        return null;
                      })}
                  </Group>
                ))}
                {selectedIds.length > 0 && (
                  <Transformer
                    nodes={selectedIds.map((id) => stageRef.current?.findOne(`#${id}`)).filter(Boolean)}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      handleTransform(node);
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Editor;