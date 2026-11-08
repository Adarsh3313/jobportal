import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <>
      <AdminSidebar />

      <div
        style={{
          marginLeft: "280px",
          padding: "30px",
          minHeight: "100vh",
          background: "#f4f7fc",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default AdminLayout;