import { Link } from "react-router-dom";

function About() {
  const stats = [
    { value: "124", label: "Open Positions" },
    { value: "2456", label: "Applications" },
    { value: "183", label: "Interviews" },
    { value: "42", label: "Offers Released" },
  ];

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
          padding: "100px 60px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          Enterprise Recruitment Platform
        </h1>

        <p
          style={{
            maxWidth: "850px",
            margin: "auto",
            fontSize: "20px",
            lineHeight: "1.8",
          }}
        >
          Transforming talent acquisition through
          intelligent hiring, applicant tracking,
          interview management and workforce
          planning.
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "-40px auto 0",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                color: "#2563eb",
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              {item.value}
            </h2>

            <p>{item.label}</p>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "80px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.05)",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Our Mission
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: "1.9",
              fontSize: "17px",
            }}
          >
            Our mission is to simplify hiring by
            providing a centralized recruitment
            ecosystem for job seekers, recruiters,
            startups and enterprises. We streamline
            applicant tracking, interview scheduling,
            hiring workflows and candidate engagement
            within a single platform.
          </p>
        </div>
      </div>

      {/* FEATURES */}
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
            marginBottom: "40px",
            fontSize: "42px",
          }}
        >
          Platform Capabilities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <FeatureCard
            title="Applicant Tracking"
            description="Track candidates throughout the recruitment lifecycle."
          />

          <FeatureCard
            title="Job Management"
            description="Create and manage enterprise job openings."
          />

          <FeatureCard
            title="Interview Hub"
            description="Schedule and manage interviews efficiently."
          />

          <FeatureCard
            title="Recruitment Analytics"
            description="Gain insights into hiring performance and trends."
          />
        </div>
      </div>

      {/* HIRING PIPELINE */}
      <div
        style={{
          padding: "100px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "42px",
          }}
        >
          Recruitment Journey
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {[
            "Application",
            "Screening",
            "Interview",
            "Offer",
            "Onboarding",
          ].map((step) => (
            <div
              key={step}
              style={{
                background: "white",
                padding: "20px 30px",
                borderRadius: "20px",
                boxShadow:
                  "0 10px 20px rgba(0,0,0,.08)",
                fontWeight: "600",
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 80px",
          padding: "60px",
          borderRadius: "30px",
          textAlign: "center",
          background:
            "linear-gradient(135deg,#0f172a,#2563eb)",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "50px",
            marginBottom: "20px",
          }}
        >
          Ready To Build The Future Workforce?
        </h2>

        <p
          style={{
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          Discover opportunities and manage
          recruitment through an enterprise-grade
          platform.
        </p>

        <Link to="/jobs">
          <button
            style={{
              background: "white",
              color: "#2563eb",
              border: "none",
              padding: "15px 30px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Explore Jobs
          </button>
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow:
          "0 10px 20px rgba(0,0,0,.05)",
      }}
    >
      <h3
        style={{
          color: "#2563eb",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#64748b",
          lineHeight: "1.8",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default About;