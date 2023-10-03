import React from "react";
import './ErrorModal.css'

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorModal;