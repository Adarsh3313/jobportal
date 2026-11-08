import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getAllCompanies,
  createCompany,
  deleteCompany,
} from "../services/companyService";

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  flex: "1 1 180px",
};

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ companyName: "", website: "", location: "" });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createCompany(form);
      setForm({ companyName: "", website: "", location: "" });
      loadCompanies();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await deleteCompany(id);
      loadCompanies();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ color: "#0b2c6b", marginBottom: "20px" }}>🏢 Manage Companies</h1>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap", background: "white", padding: "20px", borderRadius: "15px", marginBottom: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}
      >
        <input style={input} placeholder="Company name *" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        <input style={input} placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input style={input} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <button type="submit" style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>
          Add Company
        </button>
      </form>

      {companies.length === 0 && <p>No companies yet.</p>}

      {companies.map((company) => (
        <div
          key={company.companyId}
          style={{ background: "white", padding: "15px 20px", marginBottom: "10px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{company.companyName}</h3>
            <small style={{ color: "#64748b" }}>
              {[company.location, company.website].filter(Boolean).join(" • ")}
            </small>
          </div>
          <button onClick={() => handleDelete(company.companyId)} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>
            Delete
          </button>
        </div>
      ))}
    </AdminLayout>
  );
}

export default ManageCompanies;
