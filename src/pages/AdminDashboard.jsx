import React, { useState, useEffect } from "react";
import {
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Loader2,
  Menu,
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

  // Handle window resizing for responsiveness
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
      <div
        style={{
          display: "flex",
          background: "#000",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2 className="animate-spin" color="#ff3333" size={40} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Stacks on mobile
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "40px", // Less padding on mobile
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <header style={{ marginBottom: isMobile ? "30px" : "50px" }}>
          <h1
            style={{
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#ff3333",
              marginBottom: "8px",
            }}
          >
            ANALYTICS
          </h1>
          <h2
            style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "300" }}
          >
            Sir Syed Gym Overview
          </h2>
        </header>

        {/* Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: isMobile ? "15px" : "20px",
          }}
        >
          <StatCard
            title="Total Registered"
            value={stats.total}
            icon={<Users size={isMobile ? 20 : 24} color="#fff" />}
            borderColor="rgba(255,255,255,0.1)"
            isMobile={isMobile}
          />
          <StatCard
            title="Active Members"
            value={stats.active}
            icon={<CheckCircle size={isMobile ? 20 : 24} color="#00ff64" />}
            borderColor="rgba(0,255,100,0.2)"
            isMobile={isMobile}
          />
          <StatCard
            title="Expired/Due"
            value={stats.expired}
            icon={<AlertCircle size={isMobile ? 20 : 24} color="#ff3333" />}
            borderColor="rgba(255,51,51,0.2)"
            isMobile={isMobile}
          />
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.revenue.toLocaleString()}`}
            icon={<TrendingUp size={isMobile ? 20 : 24} color="#00ff64" />}
            borderColor="rgba(0,255,100,0.1)"
            isMobile={isMobile}
          />
        </div>

        {/* System Status Section */}
        <section
          style={{
            marginTop: isMobile ? "30px" : "50px",
            padding: isMobile ? "20px" : "40px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: isMobile ? "20px" : "32px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "400",
              color: "#666",
              marginBottom: "15px",
            }}
          >
            System Status
          </h3>
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ff64",
                boxShadow: "0 0 8px #00ff64",
              }}
            ></div>
            <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
              DB: MongoDB Atlas Active
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, borderColor, isMobile }) => (
  <div
    style={{
      padding: isMobile ? "20px" : "30px",
      background: "#111",
      borderRadius: isMobile ? "16px" : "24px",
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "10px" : "15px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          color: "#444",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      {icon}
    </div>
    <span
      style={{
        fontSize: isMobile ? "28px" : "38px",
        fontWeight: "700",
        color: value === 0 || value === "Rs. 0" ? "#444" : "#fff",
      }}
    >
      {value}
    </span>
  </div>
);

export default AdminDashboard;
