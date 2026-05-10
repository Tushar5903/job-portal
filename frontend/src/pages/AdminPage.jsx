import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  getAdminJobs,
  getAdminCompanies,
  getAdminApplications,
} from "../api/api.js";
import "./AdminPage.css";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const loadDetails = async (view) => {
    setSelectedView(view);
    setDetailError(null);
    setDetailLoading(true);

    try {
      let response;
      switch (view) {
        case "candidates":
          response = await getAdminUsers("candidate");
          break;
        case "employers":
          response = await getAdminUsers("employer");
          break;
        case "companies":
          response = await getAdminCompanies();
          break;
        case "jobs":
          response = await getAdminJobs();
          break;
        case "activeJobs":
          response = await getAdminJobs("?status=active");
          break;
        case "applications":
          response = await getAdminApplications();
          break;
        default:
          response = await getAdminUsers();
      }
      setDetails(response.data || []);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <section className="page-container admin-page">
      <div className="section-header">
        <div>
          <h2>Admin dashboard</h2>
          <p>Monitor the platform and click summary cards to inspect user data.</p>
        </div>
      </div>

      {loading && <div className="info-box">Loading admin data...</div>}
      {error && <div className="error-box">{error}</div>}

      {stats && (
        <div className="stats-grid admin-stats-grid">
          <button className={`stat-card clickable ${selectedView === "users" ? "active" : ""}`} onClick={() => loadDetails("users")}> 
            <strong>{stats.users}</strong>
            <span>Total users</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "candidates" ? "active" : ""}`} onClick={() => loadDetails("candidates")}> 
            <strong>{stats.candidates}</strong>
            <span>Candidates</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "employers" ? "active" : ""}`} onClick={() => loadDetails("employers")}> 
            <strong>{stats.employers}</strong>
            <span>Employers</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "companies" ? "active" : ""}`} onClick={() => loadDetails("companies")}> 
            <strong>{stats.companies}</strong>
            <span>Companies</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "jobs" ? "active" : ""}`} onClick={() => loadDetails("jobs")}> 
            <strong>{stats.jobs}</strong>
            <span>Total jobs</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "activeJobs" ? "active" : ""}`} onClick={() => loadDetails("activeJobs")}> 
            <strong>{stats.activeJobs}</strong>
            <span>Active jobs</span>
          </button>
          <button className={`stat-card clickable ${selectedView === "applications" ? "active" : ""}`} onClick={() => loadDetails("applications")}> 
            <strong>{stats.applications}</strong>
            <span>Applications</span>
          </button>
        </div>
      )}

      {selectedView && (
        <div className="detail-panel">
          <div className="detail-header">
            <h3>
              {selectedView === "users" && "All users"}
              {selectedView === "candidates" && "Candidates"}
              {selectedView === "employers" && "Employers"}
              {selectedView === "companies" && "Companies"}
              {selectedView === "jobs" && "All jobs"}
              {selectedView === "activeJobs" && "Active jobs"}
              {selectedView === "applications" && "Applications"}
            </h3>
            <p>Click a card to review details for the selected admin view.</p>
          </div>
          {detailLoading && <div className="info-box">Loading details...</div>}
          {detailError && <div className="error-box">{detailError}</div>}

          <div className="grid-list admin-detail-list">
            {details.length === 0 && !detailLoading ? (
              <div className="info-box">No items found for this view.</div>
            ) : (
              details.map((item) => {
                if (selectedView === "companies") {
                  return (
                    <article key={item._id} className="list-card admin-card">
                      <h3>{item.name}</h3>
                      <p>{item.industry} · {item.size}</p>
                      <div className="meta-row">
                        <span>{item.location}</span>
                        <span>{item.website}</span>
                      </div>
                      <p>{item.description}</p>
                    </article>
                  );
                }

                if (selectedView === "jobs" || selectedView === "activeJobs") {
                  return (
                    <article key={item._id} className="list-card admin-card">
                      <h3>{item.title}</h3>
                      <p>{item.company?.name || "Company"} · {item.location}</p>
                      <div className="meta-row">
                        <span>{item.type}</span>
                        <span>{item.workMode}</span>
                        <span>{item.status}</span>
                      </div>
                      <p>{item.requirements}</p>
                    </article>
                  );
                }

                if (selectedView === "applications") {
                  return (
                    <article key={item._id} className="list-card admin-card">
                      <h3>{item.candidate?.fullName || "Candidate"}</h3>
                      <p>{item.candidate?.email}</p>
                      <div className="meta-row">
                        <span>{item.status}</span>
                        <span>{item.job?.title}</span>
                      </div>
                      {item.resumeUrl && (
                        <a href={item.resumeUrl} target="_blank" rel="noreferrer" className="link-button">
                          Resume
                        </a>
                      )}
                    </article>
                  );
                }

                return (
                  <article key={item._id} className="list-card admin-card">
                    <h3>{item.fullName}</h3>
                    <p>{item.email}</p>
                    <div className="meta-row">
                      <span>{item.role}</span>
                      <span>{item.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    {item.candidateProfile && (
                      <>
                        <p className="candidate-headline">{item.candidateProfile.headline}</p>
                        <p>{item.candidateProfile.location}</p>
                        <p>{item.candidateProfile.education}</p>
                        {item.candidateProfile.resumeUrl && (
                          <a href={item.candidateProfile.resumeUrl} target="_blank" rel="noreferrer" className="link-button">
                            Resume
                          </a>
                        )}
                      </>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
    </section>
  );
}
