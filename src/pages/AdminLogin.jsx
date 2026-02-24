import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/.netlify/functions/auth', { username, password });
      if (response.status === 200) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      }
    } catch { 
      setError('UNAUTHORIZED ACCESS'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
      padding: '20px', // Keeps card away from screen edges on mobile
      overflowY: 'auto'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: isMobile ? '30px 20px' : '40px', 
          background: 'rgba(255,255,255,0.02)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '32px', 
          border: '1px solid rgba(255,255,255,0.1)', 
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <ShieldCheck size={isMobile ? 32 : 40} color="#ff3333" style={{ marginBottom: '20px' }} />
        
        <h1 style={{ 
          fontSize: '10px', 
          letterSpacing: isMobile ? '4px' : '6px', 
          color: '#666', 
          marginBottom: '8px', 
          textTransform: 'uppercase' 
        }}>
          Iron Core Gym
        </h1>
        
        <h2 style={{ 
          fontSize: isMobile ? '20px' : '24px', 
          fontWeight: '300', 
          marginBottom: '32px', 
          letterSpacing: '-0.5px' 
        }}>
          Admin Portal
        </h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#444' }} />
            <input 
              style={{ 
                width: '100%', 
                padding: '15px 15px 15px 45px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid #222', 
                borderRadius: '14px', 
                color: '#fff', 
                outline: 'none',
                boxSizing: 'border-box' // Essential for responsiveness
              }}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#444' }} />
            <input 
              type="password"
              style={{ 
                width: '100%', 
                padding: '15px 15px 15px 45px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid #222', 
                borderRadius: '14px', 
                color: '#fff', 
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <p style={{ 
              color: '#ff3333', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              margin: '0' 
            }}>
              {error}
            </p>
          )}

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#ff4444' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#ff3333', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '14px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '10px', 
              transition: '0.3s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'VERIFYING...' : 'AUTHORIZE'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;