import React, { useState, useEffect } from 'react';
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter members based on search term
  const filtered = searchTerm.length >= 3 
    ? members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={overlayStyle}
        >
          <motion.div 
            initial={{ scale: 0.95, y: isMobile ? 0 : 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: isMobile ? 0 : 20 }}
            style={{
              ...modalStyle,
              width: isMobile ? '100%' : '450px',
              height: isMobile ? '100dvh' : 'auto', // Full screen on mobile for easier typing
              borderRadius: isMobile ? '0' : '32px',
              maxWidth: isMobile ? '100%' : '450px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px',
              paddingTop: isMobile ? '20px' : '0' 
            }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '18px', fontWeight: '300', color: '#fff' }}>
                Find Your Profile
              </h3>
              <div 
                onClick={onClose} 
                style={{ padding: '8px', cursor: 'pointer', background: '#111', borderRadius: '50%' }}
              >
                <X size={20} color="#666" />
              </div>
            </div>

            <div style={{
              ...searchContainer,
              padding: isMobile ? '18px' : '15px'
            }}>
              <Search size={18} color="#444" />
              <input 
                type="text" 
                placeholder="Type your name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInput}
                autoFocus
              />
              {searchTerm && (
                <X 
                  size={16} 
                  color="#ff3333" 
                  onClick={() => setSearchTerm('')} 
                  style={{ cursor: 'pointer' }} 
                />
              )}
            </div>

            <div style={{
              ...resultsArea,
              maxHeight: isMobile ? 'none' : '300px',
              flex: isMobile ? 1 : 'none',
              minHeight: 0
            }}>
              {filtered.length > 0 ? (
                filtered.map(m => (
                  <div key={m._id} style={{
                    ...resultRow,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '8px' : '0'
                  }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>{m.name}</div>
                      <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Phone size={12} color="#444" /> 
                        {m.phone.replace(/.(?=.{4})/g, '*')}
                      </div>
                    </div>
                    <div style={{
                      ...tipText,
                      alignSelf: isMobile ? 'flex-end' : 'center'
                    }}>
                      Use this to sign in
                    </div>
                  </div>
                ))
              ) : searchTerm.length >= 3 ? (
                <p style={emptyText}>No members found</p>
              ) : (
                <p style={emptyText}>Enter at least 3 characters...</p>
              )}
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
  background: 'rgba(0,0,0,0.95)', 
  backdropFilter: 'blur(10px)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: 5000 
};

const modalStyle = { 
  background: '#0a0a0a', 
  border: '1px solid #222', 
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
};

const searchContainer = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  background: '#111', 
  borderRadius: '16px', 
  border: '1px solid #222' 
};

const searchInput = { 
  background: 'none', 
  border: 'none', 
  color: '#fff', 
  fontSize: '16px', 
  outline: 'none', 
  width: '100%',
  WebkitAppearance: 'none' // Fix for iOS input styling
};

const resultsArea = { 
  marginTop: '20px', 
  overflowY: 'auto',
  paddingRight: '5px' 
};

const resultRow = { 
  padding: '18px 0', 
  borderBottom: '1px solid #1a1a1a', 
  display: 'flex', 
  justifyContent: 'space-between' 
};

const tipText = { 
  fontSize: '9px', 
  color: '#ff3333', 
  letterSpacing: '1px', 
  textTransform: 'uppercase',
  background: 'rgba(255,51,51,0.05)',
  padding: '4px 8px',
  borderRadius: '4px'
};

const emptyText = { 
  textAlign: 'center', 
  color: '#444', 
  fontSize: '13px', 
  marginTop: '40px' 
};

export default SearchModal;