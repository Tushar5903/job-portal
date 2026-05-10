import { useEffect, useState } from "react";
import { getMyApplications } from "../api/api.js";
import "./CandidatePage.css";

export default function CandidatePage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await getMyApplications();
        setApplications(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <section className="page-container candidate-page">
      <div className="section-header">
        <div>
          <h2>Candidate dashboard</h2>
          <p>View your applications, status, and resume readiness.</p>
        </div>
      </div>

      {loading && <div className="info-box">Loading applications...</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="grid-list candidate-list">
        {applications.length === 0 && !loading ? (
          <div className="info-box">No applications found yet.</div>
        ) : (
          applications.map((application) => (
            <article key={application._id} className="list-card candidate-card">
              <h3>{application.job?.title || "Job title"}</h3>
              <p>{application.job?.company?.name || "Employer"} · {application.job?.location}</p>
              <div className="meta-row">
                <span>{application.job?.type || "Type"}</span>
                <span>{application.job?.workMode || "Mode"}</span>
              </div>
              <div className="status-row">
                <span>Status</span>
                <strong>{application.status}</strong>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
