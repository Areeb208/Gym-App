import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Calendar,
  LogIn,
} from "lucide-react";
import axios from "axios";
import SearchModal from "../components/common/SearchModal";

const CheckInPage = () => {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const [member, setMember] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("/.netlify/functions/members");
        setAllMembers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleCheckIn = async (e) => {
    if (e) e.preventDefault();
    if (!phone) return;
    setStatus("loading");

    try {
      const res = await axios.get("/.netlify/functions/members");
      const foundMember = res.data.find((m) => m.phone.trim() === phone.trim());

      if (foundMember) {
        const today = new Date();
        const expiry = new Date(foundMember.membershipEnd);

        if (expiry > today) {
          setMember(foundMember);
          setStatus("success");
          try {
            await axios.post(`/.netlify/functions/members?action=checkin`, {
              memberId: foundMember._id,
              name: foundMember.name,
            });
          } catch (err) {
            console.error("Failed to log attendance:", err);
          }
          setTimeout(() => {
            setStatus("idle");
            setPhone("");
            setMember(null);
          }, 5000);
        } else {
          setStatus("expired");
          setMember(foundMember);
        }
      } else {
        setStatus("not-found");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setStatus("error");
    }
  };

  return (
    <div style={containerStyle}>
      <AnimatePresence mode="wait">
        {(status === "idle" || status === "loading") && (
          <motion.div
            key="input-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ ...formWrapper, maxWidth: isMobile ? "90%" : "450px" }}
          >
            <h1
              style={{
                ...logoHeader,
                fontSize: isMobile ? "14px" : "18px",
                letterSpacing: isMobile ? "8px" : "12px",
              }}
            >
              SIR SYED GYM
            </h1>

            <div
              style={{
                ...cardStyle,
                padding: isMobile ? "30px 20px" : "50px 40px",
              }}
            >
              <div style={iconHeader}>
                <UserCheck size={isMobile ? 32 : 40} color="#ff3333" />
              </div>
              <h2
                style={{ ...cardTitle, fontSize: isMobile ? "24px" : "32px" }}
              >
                Welcome Back
              </h2>
              <p style={cardSub}>Enter your phone number to check-in</p>

              <form onSubmit={handleCheckIn}>
                <input
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    ...inputStyle,
                    fontSize: isMobile ? "22px" : "28px",
                  }}
                  autoFocus
                />
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#ff3333",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={buttonStyle}
                >
                  {status === "loading" ? "VERIFYING..." : "SIGN IN"}{" "}
                  <ArrowRight size={18} />
                </motion.button>
              </form>

              <button onClick={() => setIsSearchOpen(true)} style={forgotLink}>
                Forgot your number?
              </button>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              ...successCard,
              width: "100%",
              boxSizing: "border-box",
              padding: isMobile ? "20px" : "40px",
            }}
          >
            <div
              style={{
                ...celebrationCircle,
                width: isMobile ? "100px" : "140px",
                height: isMobile ? "100px" : "140px",
              }}
            >
              <CheckCircle2 size={isMobile ? 50 : 80} color="#00ff64" />
            </div>
            <p style={statusTag}>ENTRY PERMITTED</p>
            <h1
              style={{ ...welcomeName, fontSize: isMobile ? "12vw" : "82px" }}
            >
              {member?.name.split(" ")[0]}
            </h1>

            <div
              style={{
                ...infoGrid,
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
              }}
            >
              <div style={infoItem}>
                <Dumbbell size={18} color="#00ff64" />
                <span>{member?.membershipType || "Active Member"}</span>
              </div>
              <div style={infoItem}>
                <Calendar size={18} color="#ff3333" />
                <span>
                  Expires:{" "}
                  {new Date(member?.membershipEnd).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>

            <div style={workoutMessage}>TIME TO CRUSH YOUR GOALS</div>
          </motion.div>
        )}

        {(status === "expired" || status === "not-found") && (
          <motion.div
            key="error-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{ ...errorWrapper, padding: "20px" }}
          >
            <AlertCircle size={isMobile ? 60 : 80} color="#ff3333" />
            <h2
              style={{
                fontSize: isMobile ? "22px" : "28px",
                marginTop: "20px",
              }}
            >
              {status === "expired" ? "MEMBERSHIP LAPSED" : "USER NOT FOUND"}
            </h2>
            <p
              style={{
                color: "#666",
                marginTop: "10px",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              {status === "expired"
                ? "Your membership ended. Please renew at the desk."
                : "That number isn't in our system."}
            </p>
            <button onClick={() => setStatus("idle")} style={retryBtn}>
              TRY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        members={allMembers}
      />

      <Link
        to="/login"
        style={{
          ...adminLinkStyle,
          bottom: isMobile ? "20px" : "30px",
          left: isMobile ? "50%" : "auto",
          transform: isMobile ? "translateX(-50%)" : "none",
        }}
      >
        <LogIn size={14} />
        ADMIN ACCESS
      </Link>
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  overflow: "hidden",
};
const logoHeader = {
  fontWeight: "900",
  color: "#fff",
  marginBottom: "30px",
  textTransform: "uppercase",
  textAlign: "center",
};
const formWrapper = {
  width: "100%",
  textAlign: "center",
  boxSizing: "border-box",
};
const cardStyle = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #1a1a1a",
  borderRadius: "40px",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
  boxSizing: "border-box",
};
const iconHeader = {
  marginBottom: "20px",
  display: "flex",
  justifyContent: "center",
};
const cardTitle = { fontWeight: "300", marginBottom: "8px" };
const cardSub = { color: "#444", fontSize: "14px", marginBottom: "40px" };
const inputStyle = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "2px solid #ff3333",
  padding: "15px",
  color: "#fff",
  textAlign: "center",
  outline: "none",
  marginBottom: "40px",
  boxSizing: "border-box",
};
const buttonStyle = {
  width: "100%",
  padding: "20px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "20px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "16px",
};
const forgotLink = {
  background: "none",
  border: "none",
  color: "#444",
  marginTop: "20px",
  fontSize: "13px",
  cursor: "pointer",
  textDecoration: "underline",
};
const successCard = { textAlign: "center", background: "#000" };
const celebrationCircle = {
  background: "rgba(0,255,100,0.05)",
  borderRadius: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 30px auto",
  border: "1px solid rgba(0,255,100,0.1)",
};
const statusTag = {
  fontSize: "14px",
  letterSpacing: "5px",
  color: "#00ff64",
  marginBottom: "15px",
};
const welcomeName = {
  fontWeight: "900",
  textTransform: "uppercase",
  lineHeight: "0.9",
  letterSpacing: "-2px",
};
const infoGrid = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginTop: "40px",
};
const infoItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
  color: "#eee",
  background: "#111",
  padding: "12px 24px",
  borderRadius: "100px",
  border: "1px solid #222",
};
const workoutMessage = {
  marginTop: "60px",
  fontSize: "11px",
  color: "#444",
  letterSpacing: "6px",
};
const errorWrapper = { textAlign: "center", maxWidth: "350px" };
const retryBtn = {
  background: "#1a1a1a",
  border: "none",
  color: "#fff",
  padding: "15px 40px",
  borderRadius: "100px",
  marginTop: "30px",
  cursor: "pointer",
  fontWeight: "600",
};
const adminLinkStyle = {
  position: "fixed",
  color: "#fff",
  textDecoration: "none",
  fontSize: "11px",
  letterSpacing: "2px",
  background: "rgba(255,255,255,0.05)",
  padding: "10px 20px",
  borderRadius: "100px",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s",
  whiteSpace: "nowrap",
};

export default CheckInPage;
