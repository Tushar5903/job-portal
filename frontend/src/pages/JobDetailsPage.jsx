import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getJob, applyToJob } from "../api/api.js";
import "./JobDetailsPage.css";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const response = await getJob(jobId);
        setJob(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId]);

  const handleApply = async (event) => {
    event.preventDefault();
    setApplyStatus(null);
    setApplying(true);

    try {
      await applyToJob(jobId, resumeFile);
      setApplyStatus({ type: "success", message: "Application submitted successfully." });
      setResumeFile(null);
    } catch (err) {
      setApplyStatus({ type: "error", message: err.message || "Unable to submit application." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <section className="page-container">Loading job details...</section>;
  }

  if (error) {
    return <section className="page-container">Error: {error}</section>;
  }

  if (!job) {
    return <section className="page-container">Job not found.</section>;
  }

  return (
    <section className="page-container">
      <div className="page-card job-detail-card">
        <button type="button" className="button secondary small back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <div className="job-header">
          <div>
            <span className="job-type">{job.type}</span>
            <h2>{job.title}</h2>
            <p>{job.company?.name || "Company"} · {job.location}</p>
          </div>
          <div className="job-badge">{job.status}</div>
        </div>

        <div className="job-info-grid">
          <div>
            <h3>Description</h3>
            <p>{job.description}</p>
          </div>
          <div>
            <h3>Details</h3>
            <ul>
              <li>Work mode: {job.workMode}</li>
              <li>Experience: {job.minExperience} years</li>
              <li>Salary: {job.salaryMin} - {job.salaryMax}</li>
              <li>Openings: {job.openings}</li>
              <li>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not set"}</li>
            </ul>
          </div>
        </div>

        <div className="job-list-section">
          <div>
            <h3>Skills</h3>
            <p>{Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}</p>
          </div>
          <div>
            <h3>Requirements</h3>
            <p>{Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements}</p>
          </div>
        </div>

        {user?.role === "candidate" && job.status === "active" && (
          <div className="apply-panel">
            <h3>Apply for this role</h3>
            <p className="small-text">Upload a resume or use your candidate profile resume.</p>
            {applyStatus?.message && (
              <div className={applyStatus.type === "success" ? "success-box" : "error-box"}>
                {applyStatus.message}
              </div>
            )}
            <form className="apply-form" onSubmit={handleApply}>
              <label>
                Attach resume (optional)
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                />
              </label>
              <button className="button" type="submit" disabled={applying}>
                {applying ? "Applying..." : "Apply now"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
