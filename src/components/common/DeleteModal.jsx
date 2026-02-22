import React, { useState, useEffect } from "react";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title = "Delete Member?",
  confirmText = "Delete Member",
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  // Track screen size for button layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={overlayStyle}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{
              ...modalStyle,
              maxWidth: isMobile ? "90%" : "400px", // Don't touch edges on mobile
              margin: "0 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <X
                size={20}
                onClick={onClose}
                style={{ cursor: "pointer", color: "#444" }}
              />
            </div>

            <div style={{ textAlign: "center", padding: isMobile ? "0 10px 10px 10px" : "0 20px 20px 20px" }}>
              <div style={iconCircle}>
                <AlertTriangle size={isMobile ? 28 : 32} color="#ff3333" />
              </div>
              
              <h3 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "400",
                  marginBottom: "10px",
                  color: "#fff"
                }}
              >
                {title}
              </h3>

              <p style={{
                  color: "#888",
                  fontSize: isMobile ? "13px" : "14px",
                  lineHeight: "1.5",
                  marginBottom: "30px",
                }}
              >
                Are you sure you want to remove <strong>{itemName}</strong>?
                This action is permanent and cannot be undone.
              </p>

              {/* Stack buttons vertically on mobile for better accessibility */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                flexDirection: isMobile ? "column-reverse" : "row" 
              }}>
                <button onClick={onClose} style={cancelBtn}>
                  Cancel
                </button>
                <button onClick={onConfirm} style={deleteBtn}>
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- STYLES ---
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3000, // Higher than sidebar and table
};

const modalStyle = {
  background: "#111",
  width: "100%",
  borderRadius: "28px",
  border: "1px solid #222",
  padding: "20px",
  boxSizing: "border-box", // Essential for mobile padding
};

const iconCircle = {
  width: "64px",
  height: "64px",
  background: "rgba(255,51,51,0.1)",
  borderRadius: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px auto",
};

const cancelBtn = {
  flex: 1,
  padding: "14px",
  background: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
};

const deleteBtn = {
  flex: 1,
  padding: "14px",
  background: "#ff3333",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
};

export default DeleteModal;