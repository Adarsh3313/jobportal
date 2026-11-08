function Contact() {
  const cardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    textAlign: "center",
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HERO */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#2563eb)",
          color: "white",
          padding: "100px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          Contact Center
        </h1>

        <p
          style={{
            maxWidth: "800px",
            margin: "auto",
            fontSize: "18px",
          }}
        >
          Connect with our recruitment specialists,
          support team and hiring operations center.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "-50px auto 0",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>📧</h2>
          <h3>Email</h3>
          <p>support@jobportal.com</p>
        </div>

        <div style={cardStyle}>
          <h2>📞</h2>
          <h3>Phone</h3>
          <p>+91 9876543210</p>
        </div>

        <div style={cardStyle}>
          <h2>📍</h2>
          <h3>Location</h3>
          <p>Chennai, India</p>
        </div>
      </div>

      {/* INFO SECTION */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "80px auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(400px,1fr))",
          gap: "25px",
        }}
      >
        <div
          style={{
            ...cardStyle,
            textAlign: "left",
          }}
        >
          <h2>Contact Information</h2>

          <br />

          <p>
            <strong>Email:</strong>
            <br />
            support@jobportal.com
          </p>

          <br />

          <p>
            <strong>Phone:</strong>
            <br />
            +91 9876543210
          </p>

          <br />

          <p>
            <strong>Address:</strong>
            <br />
            Chennai, Tamil Nadu, India
          </p>
        </div>

        <div
          style={{
            ...cardStyle,
            textAlign: "left",
          }}
        >
          <h2>Support Hours</h2>

          <br />

          <p>
            Monday - Friday
            <br />
            <strong>9:00 AM - 6:00 PM</strong>
          </p>

          <br />

          <p>
            Saturday
            <br />
            <strong>9:00 AM - 1:00 PM</strong>
          </p>

          <br />

          <p>
            Sunday
            <br />
            <strong>Closed</strong>
          </p>
        </div>
      </div>

      {/* SERVICES */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Support Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <div style={cardStyle}>
            🎯 Candidate Support
          </div>

          <div style={cardStyle}>
            📄 Job Applications
          </div>

          <div style={cardStyle}>
            🎤 Interview Support
          </div>

          <div style={cardStyle}>
            🏢 Recruiter Assistance
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "80px auto",
          padding: "60px",
          borderRadius: "30px",
          background:
            "linear-gradient(135deg,#0f172a,#2563eb)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            marginBottom: "20px",
          }}
        >
          Need Recruitment Assistance?
        </h2>

        <p>
          Our support team helps candidates,
          recruiters and hiring departments
          throughout the recruitment lifecycle.
        </p>
      </div>
    </div>
  );
}

export default Contact;