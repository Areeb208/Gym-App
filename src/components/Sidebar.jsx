import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Banknote } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = (path) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    gap: isMobile ? "4px" : "12px",
    padding: isMobile ? "10px 0" : "12px 20px",
    color: location.pathname === path ? (isMobile ? "#ff3333" : "#fff") : "#555",
    textDecoration: "none",
    background: !isMobile && location.pathname === path ? "rgba(255,255,255,0.05)" : "transparent",
    borderRadius: "12px",
    transition: "0.3s",
    marginBottom: isMobile ? "0" : "8px",
    flex: isMobile ? 1 : "none",
    fontSize: isMobile ? "10px" : "14px",
    textAlign: "center",
  });

  if (isMobile) {
    // MOBILE BOTTOM NAVIGATION
    return (
      <nav style={mobileNavContainer}>
        <Link to="/admin/dashboard" style={linkStyle("/admin/dashboard")}>
          <LayoutDashboard size={20} />
          <span>Stats</span>
        </Link>

        <Link to="/admin/members" style={linkStyle("/admin/members")}>
          <Users size={20} />
          <span>Members</span>
        </Link>

        <Link to="/admin/revenue" style={linkStyle("/admin/revenue")}>
          <Banknote size={20} />
          <span>Finance</span>
        </Link>

        <Link to="/" style={{ ...linkStyle(""), color: "#444" }}>
          <LogOut size={20} />
          <span>Exit</span>
        </Link>
      </nav>
    );
  }

  // DESKTOP SIDEBAR
  return (
    <div style={sidebarContainer}>
      <h2 style={logoStyle}>IRON CORE GYM</h2>

      <Link to="/admin/dashboard" style={linkStyle("/admin/dashboard")}>
        <LayoutDashboard size={20} /> Dashboard
      </Link>

      <Link to="/admin/members" style={linkStyle("/admin/members")}>
        <Users size={20} /> Members
      </Link>

      <Link to="/admin/revenue" style={linkStyle("/admin/revenue")}>
        <Banknote size={20} /> Revenue
      </Link>

      <div style={{ marginTop: "auto" }}>
        <Link to="/" style={{ ...linkStyle(""), color: "#ff3333" }}>
          <LogOut size={20} /> Terminal Mode
        </Link>
      </div>
    </div>
  );
};

// --- STYLES ---

const sidebarContainer = {
  width: "260px",
  borderRight: "1px solid #111",
  height: "100%",
  padding: "40px 20px",
  display: "flex",
  flexDirection: "column",
  background: "#000",
  flexShrink: 0,
  overflowY: "auto",
  boxSizing: "border-box",
};

const mobileNavContainer = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "70px",
  background: "#050505",
  borderTop: "1px solid #111",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "0 10px",
  zIndex: 1000,
  backdropFilter: "blur(10px)",
  boxSizing: "border-box",
};

const logoStyle = {
  fontSize: "14px",
  letterSpacing: "4px",
  color: "#ff3333",
  marginBottom: "40px",
  fontWeight: "bold",
};

export default Sidebar;