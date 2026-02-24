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
  const [statusFilter, setStatusFilter] = useState("ALL"); // New Filter State
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  useEffect(() => {
    loadMembers();
  }, []);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const getStatus = (dateString) => {
    const end = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { label: "EXPIRED", color: "#ff3333", bg: "rgba(255,51,51,0.1)" };
    if (diffDays <= 5)
      return { label: "DUE SOON", color: "#ffcc00", bg: "rgba(255,204,0,0.1)" };
    return { label: "ACTIVE", color: "#00ff64", bg: "rgba(0,255,100,0.1)" };
  };

  // Compound Filter Logic: Search + Status Pill
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);
    if (statusFilter === "ALL") return matchesSearch;

    const status = getStatus(m.membershipEnd);
    return matchesSearch && status.label === statusFilter;
  });

  const handleSaveMember = async (data) => {
    try {
      if (editingMember) await memberApi.update(editingMember._id, data);
      else await memberApi.create(data);
      setFormOpen(false);
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100dvh",
        backgroundColor: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: isMobile ? "20px 20px 120px 20px" : "40px",
          overflowY: "auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "300",
              margin: 0,
            }}
          >
            Gym Directory
          </h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#444",
                }}
              />
              <input
                placeholder="Search name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...searchStyle, paddingLeft: "40px", width: "100%" }}
              />
            </div>
            <button
              onClick={() => {
                setEditingMember(null);
                setFormOpen(true);
              }}
              style={regBtn}
            >
              <UserPlus size={18} /> {isMobile ? "" : "Register"}
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div style={filterBarContainer}>
          {["ALL", "ACTIVE", "DUE SOON", "EXPIRED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                ...filterTabStyle,
                backgroundColor: statusFilter === tab ? "#fff" : "#111",
                color: statusFilter === tab ? "#000" : "#555",
                borderColor: statusFilter === tab ? "#fff" : "#222",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div
          style={{
            ...tableContainer,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: isMobile ? "700px" : "100%",
            }}
          >
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
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "50px" }}
                  >
                    <Loader2
                      className="animate-spin"
                      color="#ff3333"
                      style={{ margin: "0 auto" }}
                    />
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      color: "#444",
                    }}
                  >
                    No members found.
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
                          transition: "background 0.2s",
                        }}
                        onClick={() => toggleExpand(m._id)}
                      >
                        <td style={{ padding: "15px" }}>
                          {isExpanded ? (
                            <ChevronUp size={16} color="#444" />
                          ) : (
                            <ChevronDown size={16} color="#444" />
                          )}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <div style={{ fontWeight: "500", fontSize: "14px" }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#444" }}>
                            {m.phone}
                          </div>
                        </td>
                        <td style={{ padding: "15px", fontSize: "13px" }}>
                          {m.membershipEnd}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <span
                            style={{
                              ...statusBadge,
                              color: status.color,
                              background: status.bg,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: "15px", textAlign: "right" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "6px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setMemberToRenew(m);
                                setRenewOpen(true);
                              }}
                              style={payBtn}
                            >
                              <Banknote size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setFormOpen(true);
                              }}
                              style={iconBtn}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setMemberToDelete(m);
                                setDeleteOpen(true);
                              }}
                              style={delBtn}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: "#0a0a0a" }}>
                          <td
                            colSpan="5"
                            style={{
                              padding: isMobile ? "10px" : "0 20px 20px 60px",
                            }}
                          >
                            <div
                              style={{
                                ...expandGrid,
                                gridTemplateColumns: isMobile
                                  ? "1fr"
                                  : "1fr 1fr",
                                padding: isMobile ? "15px" : "20px",
                              }}
                            >
                              <div style={detailItem}>
                                <MapPin size={14} color="#ff3333" />
                                <span>
                                  <strong>Address:</strong> {m.address || "N/A"}
                                </span>
                              </div>
                              <div style={detailItem}>
                                <Clock size={14} color="#00ff64" />
                                <span>
                                  <strong>Last Seen:</strong>{" "}
                                  {m.lastCheckIn
                                    ? new Date(m.lastCheckIn).toLocaleString()
                                    : "Never"}
                                </span>
                              </div>
                              <div style={detailItem}>
                                <Calendar size={14} color="#444" />
                                <span>
                                  <strong>Joined:</strong>{" "}
                                  {m.joinedDate || "N/A"}
                                </span>
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
          await axios.patch(
            `/.netlify/functions/members?id=${memberToRenew._id}`,
            { amount: 700 },
          );
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
const filterBarContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "25px",
  overflowX: "auto",
  paddingBottom: "5px",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const filterTabStyle = {
  padding: "8px 20px",
  borderRadius: "25px",
  fontSize: "11px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s",
  whiteSpace: "nowrap",
  border: "1px solid transparent",
  letterSpacing: "0.5px",
};

const expandGrid = {
  display: "grid",
  gap: "15px",
  background: "#000",
  borderRadius: "12px",
  border: "1px solid #111",
};
const detailItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  color: "#aaa",
};
const searchStyle = {
  background: "#111",
  border: "1px solid #222",
  padding: "12px",
  borderRadius: "12px",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};
const regBtn = {
  background: "#fff",
  color: "#000",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "700",
};
const tableContainer = {
  background: "#080808",
  borderRadius: "20px",
  border: "1px solid #111",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};
const theadStyle = {
  textAlign: "left",
  color: "#444",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};
const statusBadge = {
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "0.5px",
};
const payBtn = {
  background: "rgba(0,255,100,0.1)",
  color: "#00ff64",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
};
const iconBtn = {
  background: "#111",
  border: "1px solid #222",
  color: "#fff",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
};
const delBtn = {
  background: "rgba(255,51,51,0.1)",
  border: "none",
  color: "#ff3333",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default MembersPage;
