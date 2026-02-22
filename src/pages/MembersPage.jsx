import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Edit3,
  UserPlus,
  Loader2,
  Banknote,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/common/DeleteModal";
import MemberForm from "../components/admin/MemberForm";
import ActionModal from "../components/common/ActionModal";
import { memberApi } from "../api/memberApi";
import axios from "axios";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [renewOpen, setRenewOpen] = useState(false);
  const [memberToRenew, setMemberToRenew] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await memberApi.getAll();
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleSaveMember = async (data) => {
    try {
      if (editingMember) await memberApi.update(editingMember._id, data);
      else await memberApi.create(data);
      setFormOpen(false);
      loadMembers();
    } catch (err) { console.error(err); }
  };

  const getStatus = (dateString) => {
    const end = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "EXPIRED", color: "#ff3333", bg: "rgba(255,51,51,0.1)" };
    if (diffDays <= 5) return { label: "DUE SOON", color: "#ffcc00", bg: "rgba(255,204,0,0.1)" };
    return { label: "ACTIVE", color: "#00ff64", bg: "rgba(0,255,100,0.1)" };
  };

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm)
  );

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      height: "100vh", 
      backgroundColor: "#000", 
      color: "#fff" 
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: isMobile ? "20px" : "40px", 
        overflowY: "auto", 
        width: "100%", 
        boxSizing: "border-box" 
      }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: "20px",
          marginBottom: "40px",
        }}>
          <h2 style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "300", margin: 0 }}>Gym Directory</h2>
          <div style={{ display: "flex", gap: "10px", width: isMobile ? "100%" : "auto" }}>
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...searchStyle, flex: 1 }}
            />
            <button
              onClick={() => { setEditingMember(null); setFormOpen(true); }}
              style={regBtn}
            >
              <UserPlus size={18} /> {isMobile ? "" : "Register"}
            </button>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div style={{ 
          ...tableContainer, 
          overflowX: "auto", // Enables swipe on mobile
          WebkitOverflowScrolling: "touch" 
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "600px" : "100%" }}>
            <thead>
              <tr style={theadStyle}>
                <th style={{ padding: "15px", width: "40px" }}></th>
                <th style={{ padding: "15px" }}>MEMBER</th>
                <th style={{ padding: "15px" }}>EXPIRY</th>
                <th style={{ padding: "15px" }}>STATUS</th>
                <th style={{ padding: "15px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>
                    <Loader2 className="animate-spin" color="#ff3333" />
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const isExpanded = expandedId === m._id;
                  const status = getStatus(m.membershipEnd);
                  return (
                    <React.Fragment key={m._id}>
                      <tr
                        style={{
                          borderBottom: isExpanded ? "none" : "1px solid #111",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onClick={() => toggleExpand(m._id)}
                      >
                        <td style={{ padding: "15px" }}>
                          {isExpanded ? <ChevronUp size={16} color="#444" /> : <ChevronDown size={16} color="#444" />}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <div style={{ fontWeight: "500", fontSize: "14px" }}>{m.name}</div>
                          <div style={{ fontSize: "11px", color: "#444" }}>{m.phone}</div>
                        </td>
                        <td style={{ padding: "15px", fontSize: "13px" }}>{m.membershipEnd}</td>
                        <td style={{ padding: "15px" }}>
                          <span style={{ ...statusBadge, color: status.color, background: status.bg }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: "15px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => { setMemberToRenew(m); setRenewOpen(true); }} style={payBtn}><Banknote size={14} /></button>
                            <button onClick={() => { setEditingMember(m); setFormOpen(true); }} style={iconBtn}><Edit3 size={14} /></button>
                            <button onClick={() => { setMemberToDelete(m); setDeleteOpen(true); }} style={delBtn}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: "#0a0a0a" }}>
                          <td colSpan="5" style={{ padding: isMobile ? "10px" : "0 20px 20px 60px" }}>
                            <div style={{ 
                              ...expandGrid, 
                              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                              padding: isMobile ? "15px" : "20px" 
                            }}>
                              <div style={detailItem}>
                                <MapPin size={14} color="#ff3333" />
                                <span><strong>Address:</strong> {m.address || "N/A"}</span>
                              </div>
                              <div style={detailItem}>
                                <Clock size={14} color="#00ff64" />
                                <span><strong>Last Seen:</strong> {m.lastCheckIn ? new Date(m.lastCheckIn).toLocaleString() : "Never"}</span>
                              </div>
                              <div style={detailItem}>
                                <Calendar size={14} color="#444" />
                                <span><strong>Joined:</strong> {m.joinedDate}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      <MemberForm
        key={editingMember ? editingMember._id : "new"}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveMember}
        initialData={editingMember}
      />

      <ActionModal
        isOpen={renewOpen}
        onClose={() => setRenewOpen(false)}
        onConfirm={async () => {
          await axios.patch(`/.netlify/functions/members?id=${memberToRenew._id}`, { amount: 700 });
          setRenewOpen(false);
          loadMembers();
        }}
        title="Collect Fees"
        message={`Renew PKR 700 for ${memberToRenew?.name}?`}
        confirmText="Confirm"
      />

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await memberApi.delete(memberToDelete._id);
          setDeleteOpen(false);
          loadMembers();
        }}
        itemName={memberToDelete?.name}
      />
    </div>
  );
};

// --- STYLES ---
const expandGrid = { display: "grid", gap: "15px", background: "#000", borderRadius: "12px", border: "1px solid #111" };
const detailItem = { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#aaa" };
const searchStyle = { background: "#111", border: "1px solid #222", padding: "10px 15px", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px" };
const regBtn = { background: "#fff", color: "#000", border: "none", padding: "10px 15px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" };
const tableContainer = { background: "#080808", borderRadius: "16px", border: "1px solid #111" };
const theadStyle = { textAlign: "left", color: "#444", fontSize: "11px", textTransform: "uppercase" };
const statusBadge = { padding: "4px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "700" };
const payBtn = { background: "rgba(0,255,100,0.1)", color: "#00ff64", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer" };
const iconBtn = { background: "#111", border: "1px solid #222", color: "#fff", padding: "6px", borderRadius: "6px", cursor: "pointer" };
const delBtn = { background: "rgba(255,51,51,0.1)", border: "none", color: "#ff3333", padding: "6px", borderRadius: "6px", cursor: "pointer" };

export default MembersPage;