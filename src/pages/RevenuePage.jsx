import React, { useState, useEffect } from "react";
import {
  Loader2,
  Calendar,
  TrendingUp,
  Trash2,
  Edit3,
  X,
  Check,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/common/DeleteModal";
import axios from "axios";

const RevenuePage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Modal & Edit States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Edit Form State
  const [editData, setEditData] = useState({
    amount: 700,
    date: "",
    memberName: "",
  });

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/.netlify/functions/payments?t=${new Date().getTime()}`
      );
      setPayments(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenEdit = (p) => {
    setSelectedPayment(p);
    setEditData({
      amount: p.amount,
      date: p.date ? p.date.split("T")[0] : "",
      memberName: p.memberName,
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      await axios.put(
        `/.netlify/functions/payments?id=${selectedPayment._id}`,
        editData
      );
      setEditOpen(false);
      await fetchPayments();
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      await axios.delete(
        `/.netlify/functions/payments?id=${selectedPayment._id}`
      );
      setDeleteOpen(false);
      await fetchPayments();
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const totalRevenue = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  return (
    <div style={{...layoutContainer, flexDirection: isMobile ? "column" : "row"}}>
      <Sidebar />

      <main style={{ flex: 1, padding: isMobile ? "20px 20px 120px 20px" : "40px", overflowY: "auto", width: "100%", boxSizing: "border-box" }}>
        <header style={{ marginBottom: isMobile ? "20px" : "40px" }}>
          <h1 style={financeSub}>FINANCE</h1>
          <h2 style={{...titleStyle, fontSize: isMobile ? "24px" : "32px"}}>Revenue History</h2>
        </header>

        {/* Stats Section */}
        <div style={{...statCard, padding: isMobile ? "20px" : "30px", maxWidth: isMobile ? "100%" : "450px"}}>
          <div>
            <p style={statLabel}>TOTAL REVENUE (PKR)</p>
            <h3 style={{...statValue, fontSize: isMobile ? "28px" : "36px"}}>
              Rs. {totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div style={{...iconCircle, padding: isMobile ? "10px" : "15px"}}>
            <TrendingUp size={isMobile ? 20 : 24} color="#00ff64" />
          </div>
        </div>

        {/* Table Section */}
        <div style={{...tableWrapper, overflowX: "auto", WebkitOverflowScrolling: "touch"}}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "600px" : "100%" }}>
            <thead>
              <tr style={theadStyle}>
                <th style={{ padding: isMobile ? "12px" : "20px" }}>DATE</th>
                <th style={{ padding: isMobile ? "12px" : "20px" }}>MEMBER</th>
                <th style={{ padding: isMobile ? "12px" : "20px" }}>AMOUNT</th>
                <th style={{ padding: isMobile ? "12px" : "20px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "100px" }}>
                    <Loader2 className="animate-spin" style={{ margin: "0 auto" }} />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "100px", color: "#444" }}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} style={rowStyle}>
                    <td style={{ padding: isMobile ? "12px" : "20px" }}>
                      <div style={dateBox}>
                        <Calendar size={14} color="#444" />
                        <span style={{fontSize: isMobile ? "12px" : "13px"}}>{new Date(p.date).toLocaleDateString("en-GB")}</span>
                      </div>
                    </td>
                    <td style={{ padding: isMobile ? "12px" : "20px", fontSize: isMobile ? "13px" : "14px" }}>
                      {p.memberName}
                    </td>
                    <td style={{...amountCell, padding: isMobile ? "12px" : "20px", fontSize: isMobile ? "14px" : "16px"}}>
                        Rs. {p.amount}
                    </td>
                    <td style={{ padding: isMobile ? "12px" : "20px", textAlign: "right" }}>
                      <div style={actionGroup}>
                        <button onClick={() => handleOpenEdit(p)} style={editBtn}>
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => { setSelectedPayment(p); setDeleteOpen(true); }} style={delBtn}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* EDIT MODAL */}
      {editOpen && (
        <div style={modalOverlay}>
          <div style={{...modalContent, maxWidth: isMobile ? "90%" : "400px", padding: isMobile ? "25px" : "40px", maxHeight: "90vh", overflowY: "auto"}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: "300", fontSize: isMobile ? "18px" : "20px" }}>Edit Record</h3>
              <span style={{ fontSize: "10px", color: "#444" }}>ID: {selectedPayment?._id.slice(-6)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={labelStyle}>Member Name</label>
                <input
                  type="text"
                  value={editData.memberName}
                  onChange={(e) => setEditData({ ...editData, memberName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Amount (PKR)</label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date Paid</label>
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "30px", flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={handleUpdate} disabled={actionLoading} style={saveBtn}>
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Save</>}
              </button>
              <button onClick={() => setEditOpen(false)} style={cancelBtn}>
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={`this payment of Rs. ${selectedPayment?.amount}`}
        title="Delete Payment?"
        confirmText="Delete Payment"
      />
    </div>
  );
};

// Styles remain identical to your base code but are accessed via the spread (...) logic above.
const layoutContainer = { display: "flex", height: "100dvh", overflow: "hidden", backgroundColor: "#000", color: "#fff" };
const financeSub = { fontSize: "10px", letterSpacing: "4px", color: "#ff3333", marginBottom: "8px" };
const titleStyle = { fontWeight: "300", color: "#fff" };
const statCard = { background: "#0a0a0a", borderRadius: "24px", border: "1px solid #1a1a1a", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" };
const statLabel = { color: "#444", fontSize: "11px", marginBottom: "8px", letterSpacing: "1px" };
const statValue = { fontWeight: "700", color: "#00ff64" };
const iconCircle = { background: "rgba(0,255,100,0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" };
const tableWrapper = { background: "rgba(255,255,255,0.01)", borderRadius: "24px", border: "1px solid #111", overflow: "hidden" };
const theadStyle = { textAlign: "left", color: "#444", fontSize: "11px", letterSpacing: "1px", borderBottom: "1px solid #111" };
const rowStyle = { borderBottom: "1px solid #0a0a0a" };
const dateBox = { display: "flex", alignItems: "center", gap: "10px" };
const amountCell = { color: "#00ff64", fontWeight: "700" };
const actionGroup = { display: "flex", justifyContent: "flex-end", gap: "8px" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#0a0a0a", borderRadius: "24px", border: "1px solid #222", width: "100%", boxSizing: "border-box" };
const labelStyle = { fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" };
const inputStyle = { width: "100%", background: "#111", border: "1px solid #222", padding: "12px", borderRadius: "12px", color: "#fff", outline: "none", boxSizing: "border-box" };
const saveBtn = { flex: 1, background: "#00ff64", color: "#000", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "700" };
const cancelBtn = { background: "#111", color: "#fff", border: "1px solid #222", padding: "12px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" };
const editBtn = { background: "#111", border: "1px solid #222", color: "#fff", padding: "8px", borderRadius: "8px", cursor: "pointer" };
const delBtn = { background: "rgba(255,51,51,0.1)", border: "none", color: "#ff3333", padding: "8px", borderRadius: "8px", cursor: "pointer" };

export default RevenuePage;