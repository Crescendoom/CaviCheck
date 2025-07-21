import { useState, useEffect } from "react";
import "../css/Toast.css";
const iconMap = {
  success: <i className="fas fa-check-circle" />,
  info: <i className="fas fa-info-circle" />,
  error: <img src="./erroricon.png" alt="Error" className="toast-icon-lg" />,
  warning: <img src="./warningicon.png" alt="Warning" className="toast-icon-lg" />,
};

const Toast = ({ type, title, message, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 5000); // auto-dismiss after 5s
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 400); // match the CSS animation duration
  };

  return (
    <div className={`toast ${type} ${exiting ? "exiting" : ""}`}>
      <div className="container-1">{iconMap[type] || iconMap.info}</div>
      <div className="container-2">
        <p>{title}</p>
        <p>{message}</p>
      </div>
      <button onClick={handleClose}>×</button>
    </div>
  );
};

export default Toast;