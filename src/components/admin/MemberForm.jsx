import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Phone, Calendar, MapPin } from 'lucide-react';

const MemberForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    membershipEnd: initialData?.membershipEnd || ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          style={overlayStyle}
        >
          <motion.form 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            onSubmit={handleSubmit} 
            style={{
              ...modalStyle,
              width: isMobile ? '100%' : '400px',
              height: isMobile ? '100%' : 'auto',
              maxHeight: isMobile ? '100%' : '90vh',
              borderRadius: isMobile ? '0' : '32px',
              padding: isMobile ? '20px' : '40px',
              overflowY: 'auto'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: isMobile ? '20px' : '30px',
              paddingTop: isMobile ? '20px' : '0'
            }}>
              <h3 style={{ fontSize: isMobile ? '22px' : '20px', fontWeight: '300', color: '#fff' }}>
                {initialData ? 'Edit Member' : 'New Registration'}
              </h3>
              <div 
                onClick={onClose} 
                style={{ padding: '8px', cursor: 'pointer', background: '#222', borderRadius: '50%' }}
              >
                <X size={20} color="#666" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={inputGroup}>
                <User size={18} style={iconStyle} />
                <input 
                  placeholder="e.g. Ali Khan" 
                  value={formData.name} 
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
                  required 
                  style={inputStyle} 
                />
              </div>

              <label style={labelStyle}>Phone Number</label>
              <div style={inputGroup}>
                <Phone size={18} style={iconStyle} />
                <input 
                  type="tel"
                  placeholder="03xx xxxxxxx" 
                  value={formData.phone} 
                  onChange={e => setFormData(p => ({...p, phone: e.target.value}))} 
                  required 
                  style={inputStyle} 
                />
              </div>

              <label style={labelStyle}>Home Address</label>
              <div style={inputGroup}>
                <MapPin size={18} style={iconStyle} />
                <input 
                  placeholder="Area / Street" 
                  value={formData.address} 
                  onChange={e => setFormData(p => ({...p, address: e.target.value}))} 
                  style={inputStyle} 
                />
              </div>

              <label style={labelStyle}>Membership Expiry</label>
              <div style={inputGroup}>
                <Calendar size={18} style={iconStyle} />
                <input 
                  type="date" 
                  value={formData.membershipEnd} 
                  onChange={e => setFormData(p => ({...p, membershipEnd: e.target.value}))} 
                  required 
                  style={{...inputStyle, colorScheme: 'dark'}} 
                />
              </div>
            </div>

            <button type="submit" style={{
              ...submitBtn,
              marginTop: isMobile ? '20px' : '10px',
              padding: isMobile ? '18px' : '16px'
            }}>
              <Save size={18} /> Save Member
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- STYLES ---
const overlayStyle = { 
  position: 'fixed', 
  inset: 0, 
  background: 'rgba(0,0,0,0.9)', 
  backdropFilter: 'blur(10px)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: 5000 
};

const modalStyle = { 
  background: '#111', 
  border: '1px solid #222', 
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  fontSize: '11px',
  color: '#555',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginLeft: '4px',
  marginBottom: '4px'
};

const inputGroup = { 
  position: 'relative', 
  marginBottom: '15px' 
};

const iconStyle = { 
  position: 'absolute', 
  left: '15px', 
  top: '50%', 
  transform: 'translateY(-50%)', 
  color: '#444' 
};

const inputStyle = { 
  width: '100%', 
  padding: '15px 15px 15px 45px', 
  background: '#000', 
  border: '1px solid #222', 
  borderRadius: '16px', 
  color: '#fff', 
  outline: 'none',
  fontSize: '16px', // Prevents iOS auto-zoom on focus
  boxSizing: 'border-box'
};

const submitBtn = { 
  width: '100%', 
  background: '#ff3333', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '16px', 
  fontWeight: '600', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '10px' 
};

export default MemberForm;