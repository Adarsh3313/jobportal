import "../styles/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">
            ENTERPRISE RECRUITMENT PLATFORM
          </span>

          <h1>
            Build High
            <br />
            Performance Teams
          </h1>

          <p>
            Streamline hiring, manage applications,
            schedule interviews and onboard top
            talent using a unified recruitment
            management platform.
          </p>

          <div className="hero-actions">
            <Link to="/jobs">
              <button className="btn-primary">
                Explore Jobs
              </button>
            </Link>

            <Link to="/register">
              <button className="btn-secondary">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics-section">
        <div className="metric-card blue">
          <h2>124</h2>
          <span>Open Positions</span>
        </div>

        <div className="metric-card purple">
          <h2>2456</h2>
          <span>Applications</span>
        </div>

        <div className="metric-card green">
          <h2>183</h2>
          <span>Interviews</span>
        </div>

        <div className="metric-card orange">
          <h2>42</h2>
          <span>Offers Released</span>
        </div>
      </section>

      {/* MODULES */}
      <section className="section">
        <h2 className="section-heading">
          Platform Modules
        </h2>

        <div className="module-grid">
          <div className="module-card">
            <h3>Applicant Tracking</h3>
            <p>
              Track candidates across every stage
              of recruitment.
            </p>
          </div>

          <div className="module-card">
            <h3>Interview Hub</h3>
            <p>
              Manage interviews and scheduling
              efficiently.
            </p>
          </div>

          <div className="module-card">
            <h3>Recruitment Analytics</h3>
            <p>
              Gain visibility into hiring
              performance.
            </p>
          </div>

          <div className="module-card">
            <h3>Offer Management</h3>
            <p>
              Streamline offer creation and
              onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="section">
        <h2 className="section-heading">
          Recruitment Pipeline
        </h2>

        <div className="pipeline">
          <div className="pipeline-step">
            Application
          </div>

          <div className="arrow">→</div>

          <div className="pipeline-step">
            Shortlisting
          </div>

          <div className="arrow">→</div>

          <div className="pipeline-step">
            Interview
          </div>

          <div className="arrow">→</div>

          <div className="pipeline-step">
            Offer
          </div>

          <div className="arrow">→</div>

          <div className="pipeline-step">
            Onboarding
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <h2 className="section-heading">
          Why Organizations Choose Us
        </h2>

        <div className="benefit-grid">
          <div className="benefit-card">
            🚀 Faster Hiring
          </div>

          <div className="benefit-card">
            📊 Hiring Analytics
          </div>

          <div className="benefit-card">
            🎯 Applicant Tracking
          </div>

          <div className="benefit-card">
            🎤 Interview Scheduling
          </div>

          <div className="benefit-card">
            🔒 Enterprise Security
          </div>

          <div className="benefit-card">
            🌎 Workforce Management
          </div>
        </div>
      </section>

      {/* SUCCESS */}
      <section className="section">
        <h2 className="section-heading">
          Success Metrics
        </h2>

        <div className="success-grid">
          <div className="success-card">
            <h2>95%</h2>
            <p>Candidate Satisfaction</p>
          </div>

          <div className="success-card">
            <h2>2400+</h2>
            <p>Successful Placements</p>
          </div>

          <div className="success-card">
            <h2>4.8/5</h2>
            <p>Recruiter Rating</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>
          Ready To Transform Hiring?
        </h2>

        <p>
          Manage jobs, applications, interviews
          and hiring decisions from a single
          platform.
        </p>

        <Link to="/jobs">
          <button className="btn-primary">
            Explore Opportunities
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h3>
            Enterprise Recruitment Platform
          </h3>

          <p>
            Talent Acquisition • Applicant
            Tracking • Interview Management
          </p>
        </div>

        <p className="copyright">
          © 2026 Enterprise Recruitment System
        </p>
      </footer>
    </div>
  );
}

export default Home;