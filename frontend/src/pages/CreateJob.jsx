import { apiFetch } from "../services/http";
import { useState } from "react";

function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    department: "",
    experience: "",
    employmentType: "",
    skills: "",
    priority: "Medium",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

    const response = await apiFetch(
  "/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(job),
        }
      );

      const result =
        await response.text();

      alert(result);

      if (!response.ok) return;

      setJob({
        title: "",
        description: "",
        location: "",
        salary: "",
        department: "",
        experience: "",
        employmentType: "",
        skills: "",
        priority: "Medium",
      });
    } catch (error) {
      console.error(error);
      alert("Job Creation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#0f172a,#2563eb)",
            color: "white",
            padding: "40px",
            borderRadius: "24px",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
            }}
          >
            Create Job Requisition
          </h1>

          <p
            style={{
              marginTop: "12px",
              opacity: "0.9",
            }}
          >
            Create and publish hiring
            opportunities across the
            recruitment platform.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 320px",
            gap: "25px",
          }}
        >
          {/* FORM */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow:
                "0 4px 18px rgba(0,0,0,.08)",
            }}
          >
            <h2>
              Job Information
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <label>
                Job Title
              </label>

              <input
                name="title"
                value={job.title}
                onChange={
                  handleChange
                }
                placeholder="Senior Java Developer"
                style={inputStyle}
                required
              />

              <label>
                Department
              </label>

              <input
                name="department"
                value={
                  job.department
                }
                onChange={
                  handleChange
                }
                placeholder="Engineering"
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label>
                    Location
                  </label>

                  <input
                    name="location"
                    value={
                      job.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Bangalore"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label>
                    Annual Salary
                  </label>

                  <input
                    type="number"
                    name="salary"
                    value={
                      job.salary
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="1200000"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label>
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={
                      job.experience
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option>
                      Select Experience
                    </option>
                    <option>
                      0-2 Years
                    </option>
                    <option>
                      2-5 Years
                    </option>
                    <option>
                      5-8 Years
                    </option>
                    <option>
                      8+ Years
                    </option>
                  </select>
                </div>

                <div>
                  <label>
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    value={
                      job.employmentType
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option>
                      Select Type
                    </option>
                    <option>
                      Full Time
                    </option>
                    <option>
                      Contract
                    </option>
                    <option>
                      Internship
                    </option>
                    <option>
                      Remote
                    </option>
                  </select>
                </div>
              </div>

              <label>
                Required Skills
              </label>

              <input
                name="skills"
                value={job.skills}
                onChange={
                  handleChange
                }
                placeholder="Java, Spring Boot, React, SQL"
                style={inputStyle}
              />

              <label>
                Hiring Priority
              </label>

              <select
                name="priority"
                value={
                  job.priority
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              >
                <option>
                  Low
                </option>
                <option>
                  Medium
                </option>
                <option>
                  High
                </option>
              </select>

              <label>
                Job Description
              </label>

              <textarea
                rows="7"
                name="description"
                value={
                  job.description
                }
                onChange={
                  handleChange
                }
                placeholder="Responsibilities, skills and qualifications..."
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  style={
                    draftButton
                  }
                >
                  Save Draft
                </button>

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  style={
                    submitButton
                  }
                >
                  {loading
                    ? "Publishing..."
                    : "Publish Job"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "20px",
            }}
          >
            <div
              style={sideCard}
            >
              <h3>
                ✅ Hiring Checklist
              </h3>

              <p>
                ✔ Job Title
              </p>
              <p>
                ✔ Description
              </p>
              <p>
                ✔ Salary
              </p>
              <p>
                ✔ Location
              </p>
              <p>
                ✔ Skills
              </p>
              <p>
                ✔ Hiring Priority
              </p>
            </div>

            <div
              style={sideCard}
            >
              <h3>
                💡 Best Practices
              </h3>

              <ul>
                <li>
                  Use specific job
                  titles
                </li>
                <li>
                  Clearly define
                  responsibilities
                </li>
                <li>
                  Include salary
                  range
                </li>
                <li>
                  List technical
                  skills
                </li>
              </ul>
            </div>

            <div
              style={sideCard}
            >
              <h3>
                📊 Hiring Snapshot
              </h3>

              <p>
                Active Jobs: 10
              </p>
              <p>
                Applicants: 25
              </p>
              <p>
                Interviews: 5
              </p>
              <p>
                Offers: 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
};

const submitButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px 25px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const draftButton = {
  background: "#334155",
  color: "white",
  border: "none",
  padding: "14px 25px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const sideCard = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow:
    "0 4px 18px rgba(0,0,0,.08)",
};

export default CreateJob;