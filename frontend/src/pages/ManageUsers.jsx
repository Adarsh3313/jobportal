import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ fullName: "", email: "", password: "" });

  const createAdmin = async (e) => {
    e.preventDefault();
    const res = await apiFetch("/api/admin/admins", {
      method: "POST",
      body: JSON.stringify(adminForm),
    });
    alert(await res.text());
    if (res.ok) {
      setAdminForm({ fullName: "", email: "", password: "" });
      setShowAdminForm(false);
      loadUsers();
    }
  };
  const [roleFilter, setRoleFilter] =
    useState("ALL");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiFetch(
        "/api/admin/users"
      );

      const data = await response.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const activateUser = async (id) => {
    try {
      await apiFetch(
        `/api/admin/activate/${id}`,
        {
          method: "PUT",
        }
      );

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const blockUser = async (id) => {
    try {
      await apiFetch(
        `/api/admin/block/${id}`,
        {
          method: "PUT",
        }
      );

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this user permanently?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(
        `/api/admin/users/${id}`,
        {
          method: "DELETE",
        }
      );

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch =
        user.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    }
  );

  return (
    <AdminLayout>
      <h1
        style={{
          color: "#0b2c6b",
          marginBottom: "25px",
        }}
      >
        👥 User Management
      </h1>

      <button
        onClick={() => setShowAdminForm(!showAdminForm)}
        style={{ background: "#0b2c6b", color: "white", border: "none", borderRadius: "8px", padding: "10px 18px", cursor: "pointer", marginBottom: "20px" }}
      >
        {showAdminForm ? "Cancel" : "➕ Add Admin"}
      </button>

      {showAdminForm && (
        <form
          onSubmit={createAdmin}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap", background: "white", padding: "20px", borderRadius: "15px", marginBottom: "25px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}
        >
          <input required placeholder="Full name" value={adminForm.fullName} onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })} style={{ padding: "10px", flex: "1 1 180px" }} />
          <input required type="email" placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} style={{ padding: "10px", flex: "1 1 180px" }} />
          <input required type="password" minLength={6} placeholder="Password (6+ chars)" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} style={{ padding: "10px", flex: "1 1 180px" }} />
          <button type="submit" style={{ background: "#16a34a", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>
            Create Admin
          </button>
        </form>
      )}

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div style={card("#2563eb")}>
          <h3>Total Users</h3>
          <h1>{users.length}</h1>
        </div>

        <div style={card("#16a34a")}>
          <h3>Active Users</h3>
          <h1>
            {
              users.filter(
                (u) =>
                  u.status === "ACTIVE"
              ).length
            }
          </h1>
        </div>

        <div style={card("#dc2626")}>
          <h3>Blocked Users</h3>
          <h1>
            {
              users.filter(
                (u) =>
                  u.status === "BLOCKED"
              ).length
            }
          </h1>
        </div>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        >
          <option value="ALL">
            All Roles
          </option>

          <option value="USER">
            User
          </option>

          <option value="HIRING_DEPARTMENT">
            Recruiter
          </option>

          <option value="ADMIN">
            Admin
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          overflowX: "auto",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Name
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Email
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Role
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Status
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Approved
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "15px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(
              (user) => (
                <tr
                  key={user.userId}
                  style={{
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    👤{" "}
                    {user.fullName}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    {user.email}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    {user.role ===
                    "ADMIN" ? (
                      <span
                        style={
                          badge(
                            "#dbeafe",
                            "#1d4ed8"
                          )
                        }
                      >
                        🛡 Admin
                      </span>
                    ) : user.role ===
                      "HIRING_DEPARTMENT" ? (
                      <span
                        style={
                          badge(
                            "#fef3c7",
                            "#d97706"
                          )
                        }
                      >
                        🏢 Recruiter
                      </span>
                    ) : (
                      <span
                        style={
                          badge(
                            "#dcfce7",
                            "#15803d"
                          )
                        }
                      >
                        👤 User
                      </span>
                    )}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    <span
                      style={{
                        background:
                          user.status ===
                          "ACTIVE"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          user.status ===
                          "ACTIVE"
                            ? "#15803d"
                            : "#dc2626",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    {user.approved
                      ? "✅"
                      : "⏳"}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          activateUser(
                            user.userId
                          )
                        }
                        style={
                          actionBtn(
                            "#16a34a"
                          )
                        }
                      >
                        ✅
                      </button>

                      <button
                        onClick={() =>
                          blockUser(
                            user.userId
                          )
                        }
                        style={
                          actionBtn(
                            "#f59e0b"
                          )
                        }
                      >
                        🚫
                      </button>

                      <button
                        style={
                          actionBtn(
                            "#2563eb"
                          )
                        }
                      >
                        👁
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(
                            user.userId
                          )
                        }
                        style={
                          actionBtn(
                            "#dc2626"
                          )
                        }
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

const card = (bg) => ({
  background: bg,
  color: "white",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.15)",
});

const badge = (
  bg,
  color
) => ({
  background: bg,
  color: color,
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "bold",
});

const actionBtn = (
  bg
) => ({
  background: bg,
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
});

export default ManageUsers;