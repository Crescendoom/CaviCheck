import React from "react";

import "../css/Toast.css";

const Toast = ({ type, title, message, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <div className="container-1">
        <i className="fas fa-info-circle" />
      </div>
      <div className="container-2">
        <p>{title}</p>
        <p>{message}</p>
      </div>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
