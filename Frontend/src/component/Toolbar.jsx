import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Toolbar = ({ onStyleChange, currentStyles, isMoveMode, toggleMoveMode, onAddElement, onDuplicateText }) => {
  const handleStyleClick = (style) => {
    if (style === "align") {
      const alignments = ["left", "center", "right"];
      const currentIndex = alignments.indexOf(currentStyles.align);
      const newAlign = alignments[(currentIndex + 1) % alignments.length];
      onStyleChange({ align: newAlign });
    } else {
      onStyleChange({ [style]: !currentStyles[style] });
    }
  };

  const handleFontSizeChange = (e) => {
    onStyleChange({ fontSize: e.target.value + "px" });
  };

  const handleFontColorChange = (e) => {
    onStyleChange({ fontColor: e.target.value });
  };

  const handleFontFamilyChange = (e) => {
    onStyleChange({ fontFamily: e.target.value });
  };

  const getAlignIcon = () => {
    switch (currentStyles.align) {
      case "center":
        return faAlignCenter;
      case "right":
        return faAlignRight;
      default:
        return faAlignLeft;
    }
  };

  return (
    <div className="toolbar bg-light p-2 mb-3 border rounded">
      <button
        type="button"
        className="btn btn-primary me-2"
        onClick={toggleMoveMode}
      >
        {isMoveMode ? "Switch to Edit Mode" : "Switch to Move Mode"}
      </button>

      {/* <button
        type="button"
        className="btn btn-success me-2"
        onClick={onAddElement}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Element
      </button> */}
      <button
        type="button"
        className="btn btn-success me-2"
        onClick={onDuplicateText}
        disabled={!currentStyles.fontSize}
      >
        <FontAwesomeIcon />Duplicate Text
      </button>
      

      <div className="btn-group me-2" role="group">
        <button
          type="button"
          onClick={() => handleStyleClick("bold")}
          className={`btn btn-outline-secondary ${currentStyles.bold ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          type="button"
          onClick={() => handleStyleClick("italic")}
          className={`btn btn-outline-secondary ${currentStyles.italic ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          type="button"
          onClick={() => handleStyleClick("underline")}
          className={`btn btn-outline-secondary ${currentStyles.underline ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button
          type="button"
          onClick={() => handleStyleClick("align")}
          className="btn btn-outline-secondary"
        >
          <FontAwesomeIcon icon={getAlignIcon()} />
        </button>
      </div>

      <div className="d-inline-block me-2">
        <label className="me-1">Size:</label>
        <input
          type="number"
          value={parseInt(currentStyles.fontSize)}
          onChange={handleFontSizeChange}
          min="1"
          className="form-control form-control-sm d-inline-block"
          style={{ width: "60px" }}
        />
      </div>

      <div className="d-inline-block me-2">
        <label className="me-1">Color:</label>
        <input
          type="color"
          value={currentStyles.fontColor}
          onChange={handleFontColorChange}
          className="form-control form-control-sm d-inline-block"
          style={{ width: "40px", padding: "0", height: "30px" }}
        />
      </div>

      <div className="d-inline-block">
        <label className="me-1">Font:</label>
        <select
          value={currentStyles.fontFamily}
          onChange={handleFontFamilyChange}
          className="form-select form-select-sm d-inline-block"
          style={{ width: "150px" }}
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Palatino">Palatino</option>
          <option value="Garamond">Garamond</option>
          <option value="Bookman">Bookman</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Arial Black">Arial Black</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;