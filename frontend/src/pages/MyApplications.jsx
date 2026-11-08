// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllApplications } from "../services/applicationService";
// import { getCandidateInterviews } from "../services/interviewService";

// function MyApplications() {
//   const [applications, setApplications] = useState([]);
//   const [interviews, setInterviews] = useState([]);

//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const apps = await getAllApplications();
//       const myApps = apps.filter((app) => app.applicantEmail === email);
//       setApplications(myApps);

//       const interviewData = await getCandidateInterviews(email);
//       setInterviews(interviewData || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const countInterviews = applications.filter((a) => a.status === "INTERVIEW").length;
//   const countSelected = applications.filter((a) => a.status === "SELECTED").length;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "APPLIED": return "#2563eb";
//       case "SHORTLISTED": return "#f59e0b";
//       case "INTERVIEW": return "#7c3aed";
//       case "SELECTED": return "#16a34a";
//       case "REJECTED": return "#dc2626";
//       default: return "#64748b";
//     }
//   };

//   const getProgress = (status) => {
//     switch (status) {
//       case "APPLIED": return 25;
//       case "SHORTLISTED": return 50;
//       case "INTERVIEW": return 75;
//       case "SELECTED": return 100;
//       default: return 0;
//     }
//   };

//   return (
//     <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "30px" }}>
//       {/* HERO */}
//       <div style={{ background: "linear-gradient(135deg,#0f172a,#2563eb)", color: "white", padding: "35px", borderRadius: "24px", marginBottom: "30px" }}>
//         <h1 style={{ margin: 0 }}>Application Tracking Center</h1>
//         <p style={{ marginTop: "10px", opacity: 0.9 }}>Track job applications, interviews and hiring progress.</p>
//       </div>

//       {/* KPI */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginBottom: "25px" }}>
//         <InfoCard title="Applications" value={applications.length} icon="📄" color="#2563eb" />
//         <InfoCard title="Interviews" value={countInterviews} icon="🎤" color="#7c3aed" />
//         <InfoCard title="Selected" value={countSelected} icon="✅" color="#16a34a" />
//       </div>

//       {/* CAREER SUMMARY */}
//       <div style={{ background: "white", borderRadius: "20px", padding: "25px", marginBottom: "25px", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
//         <h2>📊 Career Summary</h2>
//         <p>Total Applications: {applications.length}</p>
//         <p>Interviews Scheduled: {countInterviews}</p>
//         <p>Offers Received: {countSelected}</p>
//         <p>Profile Status: Active</p>
//       </div>

//       {/* APPLICATIONS LIST */}
//       {applications.length === 0 ? (
//         <div style={{ background: "white", padding: "70px", borderRadius: "24px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
//           <div style={{ fontSize: "80px" }}>📄</div>
//           <h2>No Applications Yet</h2>
//           <p style={{ color: "#64748b" }}>Start exploring opportunities and submit your first application.</p>
//           <Link to="/jobs">
//             <button style={{ marginTop: "15px", background: "#2563eb", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>
//               Browse Jobs
//             </button>
//           </Link>
//         </div>
//       ) : (
//         applications.map((app) => {
//           const appInterviews = interviews.filter((i) => i.candidateEmail === app.applicantEmail);

//           return (
//             <div key={app.applicationId} style={{ background: "white", borderRadius: "20px", padding: "30px", marginBottom: "25px", boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <div>
//                   <h2>Job #{app.jobId}</h2>
//                   <p>Application ID: {app.applicationId}</p>
//                   <p>Candidate: {app.applicantName}</p>
//                 </div>
//                 <div style={{ background: getStatusColor(app.status), color: "white", padding: "10px 18px", borderRadius: "999px", fontWeight: "bold" }}>
//                   {app.status}
//                 </div>
//               </div>

//               {/* PROGRESS */}
//               <div style={{ marginTop: "20px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <strong>Hiring Progress</strong>
//                   <strong>{getProgress(app.status)}%</strong>
//                 </div>
//                 <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", marginTop: "10px" }}>
//                   <div style={{ height: "100%", width: `${getProgress(app.status)}%`, background: getStatusColor(app.status), borderRadius: "999px" }} />
//                 </div>
//               </div>

//               {/* TIMELINE */}
//               <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
//                 <TimelineStep active label="Applied" />
//                 <TimelineStep active={["SHORTLISTED", "INTERVIEW", "SELECTED"].includes(app.status)} label="Shortlisted" />
//                 <TimelineStep active={["INTERVIEW", "SELECTED"].includes(app.status)} label="Interview" />
//                 <TimelineStep active={app.status === "SELECTED"} label="Selected" />
//               </div>

//               {/* INTERVIEW DETAILS */}
//               {appInterviews.map((interview) => (
//                 <div key={interview.interviewId} style={{ marginTop: "25px", background: "#eef2ff", padding: "20px", borderRadius: "15px" }}>
//                   <h3>📅 Interview Details</h3>
//                   <p><strong>Date:</strong> {interview.interviewDate}</p>
//                   <p><strong>Time:</strong> {interview.interviewTime}</p>
//                   <p><strong>Mode:</strong> {interview.mode}</p>
//                   <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                  
//                   {interview.meetingLink && (
//                     <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", padding: "10px 18px", background: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}>
//                       Join Meeting
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }

// function InfoCard({ title, value, icon, color }) {
//   return (
//     <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <div>
//           <p style={{ color: "#64748b" }}>{title}</p>
//           <h1 style={{ color, margin: 0 }}>{value}</h1>
//         </div>
//         <div style={{ fontSize: "40px" }}>{icon}</div>
//       </div>
//     </div>
//   );
// }

// function TimelineStep({ active, label }) {
//   return (
//     <div style={{ textAlign: "center", flex: 1 }}>
//       <div style={{ width: "45px", height: "45px", borderRadius: "50%", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: active ? "#16a34a" : "#cbd5e1", color: "white", fontWeight: "bold" }}>
//         {active ? "✓" : ""}
//       </div>
//       <p>{label}</p>
//     </div>
//   );
// }

// export default MyApplications;,

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllApplications } from "../services/applicationService";
import { getCandidateInterviews } from "../services/interviewService";
import { getJobById } from "../services/jobService";
import { apiFetch } from "../services/http";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState({});
  const [search, setSearch] = useState("");
  const [offers, setOffers] = useState([]);
  const [history, setHistory] = useState({});

  const respondOffer = async (offerId, decision) => {
    if (!window.confirm(decision === "ACCEPTED" ? "Accept this offer?" : "Decline this offer?")) return;
    const res = await apiFetch(`/api/offers/${offerId}/respond`, { method: "PUT", body: JSON.stringify({ decision }) });
    alert(await res.text());
    loadData();
  };

  const email = localStorage.getItem("email");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apps = await getAllApplications();
      const myApps = apps.filter((app) => app.applicantEmail === email);
      setApplications(myApps);

      const offerRes = await apiFetch("/api/offers");
      setOffers(offerRes.ok ? await offerRes.json() : []);

      const hist = {};
      for (const app of myApps) {
        const r = await apiFetch(`/api/applications/${app.applicationId}/history`);
        hist[app.applicationId] = r.ok ? await r.json() : [];
      }
      setHistory(hist);

      const interviewData = await getCandidateInterviews(email);
      setInterviews(interviewData || []);

      const jobsMap = {};
      for (const app of myApps) {
        try {
          const job = await getJobById(app.jobId);
          jobsMap[app.jobId] = job;
        } catch (error) {
          console.error(error);
        }
      }
      setJobs(jobsMap);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED": return "#2563eb";
      case "SHORTLISTED": return "#f59e0b";
      case "INTERVIEW": return "#7c3aed";
      case "SELECTED": return "#16a34a";
      case "OFFER_SENT": return "#0891b2";
      case "OFFER_ACCEPTED": return "#15803d";
      case "OFFER_DECLINED": return "#b45309";
      case "REJECTED": return "#dc2626";
      default: return "#64748b";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "APPLIED": return 25;
      case "SHORTLISTED": return 50;
      case "INTERVIEW": return 75;
      case "SELECTED": return 85;
      case "OFFER_SENT": return 92;
      case "OFFER_ACCEPTED": return 100;
      default: return 0;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const job = jobs[app.jobId];
    return (
      job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.status?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalApplications = applications.length;
  const totalInterviews = applications.filter((a) => a.status === "INTERVIEW").length;
  const totalSelected = applications.filter((a) => ["SELECTED", "OFFER_SENT", "OFFER_ACCEPTED"].includes(a.status)).length;
  const totalShortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;

  const nextInterview = interviews.length > 0 ? interviews[0] : null;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "30px" }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#2563eb)", color: "white", padding: "40px", borderRadius: "24px", marginBottom: "25px" }}>
        <h1 style={{ margin: 0 }}>Career Portal</h1>
        <p style={{ marginTop: "10px", opacity: 0.9 }}>Track your applications, interviews and recruitment progress.</p>
      </div>

      {nextInterview && (
        <div style={{ background: "#eef2ff", borderLeft: "6px solid #4f46e5", padding: "20px", borderRadius: "14px", marginBottom: "25px" }}>
          <h3>🎤 Upcoming Interview</h3>
          <p>Date: {nextInterview.interviewDate}</p>
          <p>Time: {nextInterview.interviewTime}</p>
          <p>Interviewer: {nextInterview.interviewer}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", marginBottom: "25px" }}>
        <InfoCard title="Applications" value={totalApplications} icon="📄" color="#2563eb" />
        <InfoCard title="Shortlisted" value={totalShortlisted} icon="⭐" color="#f59e0b" />
        <InfoCard title="Interviews" value={totalInterviews} icon="🎤" color="#7c3aed" />
        <InfoCard title="Offers" value={totalSelected} icon="✅" color="#16a34a" />
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "25px", marginBottom: "25px", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
        <h2>Candidate Profile</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Resume:</strong> Verified ✅</p>
        <p><strong>Profile Status:</strong> Active</p>
      </div>

      <div style={{ background: "white", padding: "15px", borderRadius: "15px", marginBottom: "25px", boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
        <input type="text" placeholder="🔍 Search Applications" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", border: "none", outline: "none", fontSize: "15px" }} />
      </div>

      {filteredApplications.length === 0 ? (
        <div style={{ background: "white", borderRadius: "24px", padding: "70px", textAlign: "center" }}>
          <div style={{ fontSize: "80px" }}>📄</div>
          <h2>No Applications Found</h2>
          <Link to="/jobs"><button style={browseBtn}>Browse Jobs</button></Link>
        </div>
      ) : (
        filteredApplications.map((app) => {
          const job = jobs[app.jobId];
          const interview = interviews.find((i) => i.applicationId === app.applicationId);

          return (
            <div key={app.applicationId} style={{ background: "white", borderRadius: "20px", padding: "25px", marginBottom: "20px", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div>
                  <h2>{job?.title || `Job #${app.jobId}`}</h2>
                  <p>📍 {job?.location}</p>
                  <p>💰 ₹{job?.salary?.toLocaleString()}</p>
                </div>
                <div style={{ background: getStatusColor(app.status), color: "white", padding: "10px 18px", borderRadius: "999px", height: "fit-content", fontWeight: "bold" }}>
                  {app.status}
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Hiring Progress</strong>
                  <strong>{getProgress(app.status)}%</strong>
                </div>
                <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", marginTop: "8px" }}>
                  <div style={{ width: `${getProgress(app.status)}%`, height: "100%", background: getStatusColor(app.status), borderRadius: "999px" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                <TimelineStep active label="Applied" />
                <TimelineStep active={["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFER_SENT", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(app.status) || (history[app.applicationId] || []).some((h) => h.status === "SHORTLISTED")} label="Shortlisted" />
                <TimelineStep active={(history[app.applicationId] || []).some((h) => h.status === "INTERVIEW")} label="Interview" />
                <TimelineStep active={["SELECTED", "OFFER_SENT", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(app.status)} label="Selected" />
                <TimelineStep active={["OFFER_SENT", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(app.status)} label="Offer Letter" />
                <TimelineStep active={app.status === "OFFER_ACCEPTED"} label="Joined/Accepted" />
              </div>

              {offers.filter((o) => o.applicationId === app.applicationId).map((o) => (
                <div key={o.offerId} style={{ marginTop: "25px", background: "#ecfeff", border: "1px solid #67e8f9", padding: "20px", borderRadius: "15px" }}>
                  <h3>📨 Offer Letter {o.companyName && `from ${o.companyName}`}</h3>
                  <p><strong>Designation:</strong> {o.designation}</p>
                  {o.salary && <p><strong>Salary:</strong> ₹ {o.salary}</p>}
                  <p><strong>Joining date:</strong> {o.joiningDate}</p>
                  {o.location && <p><strong>Location:</strong> {o.location}</p>}
                  {o.validUntil && <p><strong>Offer valid until:</strong> {o.validUntil}</p>}
                  {o.message && <p style={{ whiteSpace: "pre-wrap" }}>{o.message}</p>}
                  {o.status === "SENT" ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => respondOffer(o.offerId, "ACCEPTED")} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>Accept Offer</button>
                      <button onClick={() => respondOffer(o.offerId, "DECLINED")} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>Decline</button>
                    </div>
                  ) : (
                    <strong>You {o.status.toLowerCase()} this offer.</strong>
                  )}
                </div>
              ))}

              {(history[app.applicationId] || []).length > 0 && (
                <details style={{ marginTop: "20px" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>📜 Full history</summary>
                  <ul style={{ marginTop: "10px" }}>
                    {history[app.applicationId].map((h, i) => (
                      <li key={i}>
                        <strong>{h.status.replace("_", " ")}</strong> — {new Date(h.changedAt.replace(" ", "T") + "Z").toLocaleString()}
                        {h.note && <span style={{ color: "#64748b" }}> ({h.note})</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {interview && (
                <div style={{ marginTop: "25px", background: "#eef2ff", padding: "20px", borderRadius: "15px" }}>
                  <h3>🎤 Interview Schedule</h3>
                  <p>Date: {interview.interviewDate}</p>
                  <p>Time: {interview.interviewTime}</p>
                  <p>Mode: {interview.mode}</p>
                  <p>Interviewer: {interview.interviewer}</p>
                  {interview.meetingLink && (
                    <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={joinBtn}>Join Meeting</a>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function InfoCard({ title, value, icon, color }) {
  return (
    <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#64748b" }}>{title}</p>
          <h1 style={{ color, margin: 0 }}>{value}</h1>
        </div>
        <div style={{ fontSize: "40px" }}>{icon}</div>
      </div>
    </div>
  );
}

function TimelineStep({ active, label }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ width: "45px", height: "45px", borderRadius: "50%", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", background: active ? "#16a34a" : "#cbd5e1", color: "white", fontWeight: "bold" }}>
        {active ? "✓" : ""}
      </div>
      <p>{label}</p>
    </div>
  );
}

const browseBtn = { marginTop: "15px", background: "#2563eb", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" };
const joinBtn = { display: "inline-block", marginTop: "10px", padding: "10px 18px", background: "#2563eb", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "600" };

export default MyApplications;