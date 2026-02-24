import React, { useState, useEffect } from "react";
import {
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { memberApi } from "../api/memberApi";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [memberRes, paymentRes] = await Promise.all([
          memberApi.getAll(),
          axios.get(`/.netlify/functions/payments?t=${new Date().getTime()}`),
        ]);
        const members = memberRes.data;
        const payments = paymentRes.data;
        const today = new Date();
        const expiredCount = members.filter(
          (m) => new Date(m.membershipEnd) < today,
        ).length;
        const activeCount = members.length - expiredCount;
        const totalRev = payments.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0,
        );
        setStats({
          total: members.length,
          active: activeCount,
          expired: expiredCount,
          revenue: totalRev,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={loadingOverlay}>
        <Loader2 className="animate-spin" color="#ff3333" size={40} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#000",
        height: "100dvh",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: isMobile ? "20px 20px 120px 20px" : "40px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <header style={{ marginBottom: isMobile ? "25px" : "40px" }}>
          <p style={analyticsLabel}>ANALYTICS</p>
          <h2
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "300",
              margin: 0,
            }}
          >
            Sir Syed Gym Overview
          </h2>
        </header>

        {/* Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(auto-fit, minmax(240px, 1fr))",
            gap: isMobile ? "12px" : "20px",
          }}
        >
          <StatCard
            title="Registered"
            value={stats.total}
            icon={<Users size={18} color="#fff" />}
            borderColor="rgba(255,255,255,0.1)"
            isMobile={isMobile}
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon={<CheckCircle size={18} color="#00ff64" />}
            borderColor="rgba(0,255,100,0.2)"
            isMobile={isMobile}
          />
          <StatCard
            title="Expired"
            value={stats.expired}
            icon={<AlertCircle size={18} color="#ff3333" />}
            borderColor="rgba(255,51,51,0.2)"
            isMobile={isMobile}
          />
          <StatCard
            title="Revenue"
            value={`${stats.revenue.toLocaleString()}`}
            prefix="Rs. "
            icon={<TrendingUp size={18} color="#00ff64" />}
            borderColor="rgba(0,255,100,0.1)"
            isMobile={isMobile}
          />
        </div>

        {/* FIXED System Status Section */}
        <section
          style={{
            marginTop: isMobile ? "25px" : "40px",
            padding: isMobile ? "20px" : "30px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3 style={statusTitle}>System Status</h3>
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center", // Ensures dot and text are on the same line
              flexDirection: "row", // Forces horizontal layout
            }}
          >
            <div style={pulseDot}></div>
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              Database:{" "}
              <span style={{ color: "#aaa", fontWeight: "600" }}>
                MongoDB Atlas Active
              </span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- StatCard Component with FIXED Corner-to-Corner alignment ---
const StatCard = ({ title, value, prefix, icon, borderColor, isMobile }) => (
  <div
    style={{
      padding: isMobile ? "15px" : "25px",
      background: "#0a0a0a",
      borderRadius: isMobile ? "16px" : "24px",
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: isMobile ? "110px" : "150px",
      boxSizing: "border-box",
    }}
  >
    {/* TOP ROW: Title on FAR LEFT, Icon on FAR RIGHT */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <span style={cardTitleStyle}>{title}</span>
      <div style={{ opacity: 0.8 }}>{icon}</div>
    </div>

    {/* BOTTOM ROW: The Value */}
    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
      {prefix && (
        <span
          style={{
            fontSize: isMobile ? "12px" : "18px",
            color: "#444",
            fontWeight: "600",
          }}
        >
          {prefix}
        </span>
      )}
      <span
        style={{
          fontSize: isMobile ? "26px" : "40px",
          fontWeight: "700",
          color: value === 0 || value === "0" ? "#333" : "#fff",
          lineHeight: "1",
        }}
      >
        {value}
      </span>
    </div>
  </div>
);

// --- Styles ---
const loadingOverlay = {
  display: "flex",
  background: "#000",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
};
const analyticsLabel = {
  fontSize: "10px",
  letterSpacing: "3px",
  color: "#ff3333",
  marginBottom: "4px",
  fontWeight: "700",
};
const cardTitleStyle = {
  fontSize: "9px",
  color: "#666",
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontWeight: "700",
};
const statusTitle = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "12px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};
const pulseDot = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#00ff64",
  boxShadow: "0 0 12px rgba(0,255,100,0.5)",
};

export default AdminDashboard;
