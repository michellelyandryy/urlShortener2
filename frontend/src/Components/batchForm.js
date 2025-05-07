import React from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import "../style/batchForm.css"; 

const batchForm = ({
  batchInputs,
  onClose,
  onAddInput,
  onInputChange,
  onSubmit
}) => {
  return (
    <div className="batch-modal">
      <div className="batch-modal-content">
        <div className="batch-header">
          <h3>Create Batch</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {batchInputs.map((val, i) => (
          <input
            key={i}
            type="text"
            className="batch-input"
            placeholder="Enter your long URL"
            value={val}
            onChange={(e) => onInputChange(e.target.value, i)}
          />
        ))}

        {batchInputs.length < 10 && (
          <button className="add-input-btn" onClick={onAddInput}>
            <FaPlus /> Add
          </button>
        )}

        <button className="btn-shorten" onClick={onSubmit}>
          Shorten
        </button>
      </div>
    </div>
  );
};

export default batchForm;
