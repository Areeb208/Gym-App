import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const ActionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
            initial={{ scale: 0.9, y: 10 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 10 }} 
            style={{
              ...modalStyle,
              padding: isMobile ? '20px' : '30px',
              width: isMobile ? '92%' : '400px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle color={confirmColor || "#00ff64"} size={isMobile ? 18 : 20} />
                <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '400', color: '#fff', margin: 0 }}>
                  {title}
                </h3>
              </div>
              <X 
                size={20} 
                onClick={onClose} 
                style={{ cursor: 'pointer', color: '#444', transition: 'color 0.2s' }} 
              />
            </div>
            
            <p style={{ 
              color: '#888', 
              lineHeight: '1.6', 
              marginBottom: '30px', 
              fontSize: isMobile ? '13px' : '14px' 
            }}>
              {message}
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              flexDirection: isMobile ? 'column-reverse' : 'row' 
            }}>
              <button onClick={onClose} style={cancelBtn}>
                Cancel
              </button>
              <button 
                onClick={onConfirm} 
                style={{ 
                  ...confirmBtn, 
                  background: confirmColor || '#00ff64',
                  padding: isMobile ? '14px' : '12px' 
                }}
              >
                {confirmText || 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- STYLES ---
const overlayStyle = { 
  position: 'fixed', 
  inset: 0, 
  background: 'rgba(0,0,0,0.85)', 
  backdropFilter: 'blur(8px)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: 4000 
};

const modalStyle = { 
  background: '#111', 
  borderRadius: '24px', 
  border: '1px solid #222',
  boxSizing: 'border-box'
};

const cancelBtn = { 
  flex: 1, 
  padding: '12px', 
  background: 'transparent', 
  border: '1px solid #222', 
  color: '#fff', 
  borderRadius: '12px', 
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
};

const confirmBtn = { 
  flex: 1, 
  border: 'none', 
  color: '#000', 
  fontWeight: '700', 
  borderRadius: '12px', 
  cursor: 'pointer',
  fontSize: '14px'
};

export default ActionModal;