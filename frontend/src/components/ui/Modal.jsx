import React from "react";
import "./Modal.css";

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;
