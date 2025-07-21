import React from "react";
import "../css/Toast.css";
const iconMap = {
  success: <i className="fas fa-check-circle" />,
  info: <i className="fas fa-info-circle" />,
  error: <img src="./erroricon.png" alt="Error" className="toast-icon-lg" />,
  warning: <img src="./warningicon.png" alt="Warning" className="toast-icon-lg" />,
};

const Toast = ({ type, title, message, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <div className="container-1">
        {iconMap[type] || iconMap.info}
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