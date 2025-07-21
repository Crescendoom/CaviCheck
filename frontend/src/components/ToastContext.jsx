import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, title, message, duration = 3000) => {
    setToast({ type, title, message });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: 380,
          maxWidth: "95vw"
        }}>
          <Toast {...toast} onClose={closeToast} />
        </div>
      )}
    </ToastContext.Provider>
  );
};