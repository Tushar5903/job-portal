import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getEmployerJobs,
  createJob,
  getJobApplicants,
  updateApplicationStatus,
} from "../api/api.js";
import "./EmployerPage.css";

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  skills: "",
  location: "",
  type: "full-time",
  workMode: "remote",
  minExperience: "0",
  salaryMin: "",
  salaryMax: "",
  openings: "1",
  deadline: "",
};

export default function EmployerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "jobs";
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicantLoading, setApplicantLoading] = useState(false);
  const [applicantError, setApplicantError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await getEmployerJobs();
        setJobs(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createJob(form);
      setSuccess("Job posted successfully.");
      setForm(initialForm);
      const response = await getEmployerJobs();
      setJobs(response.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadApplicants = async (job) => {
    setSelectedJobId(job._id);
    setApplicants([]);
    setApplicantError(null);
    setApplicantLoading(true);

    try {
      const response = await getJobApplicants(job._id);
      setApplicants(response.data || []);
    } catch (err) {
      setApplicantError(err.message);
    } finally {
      setApplicantLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    setStatusLoading(true);
    setApplicantError(null);

    try {
      await updateApplicationStatus(applicationId, status);
      if (selectedJobId) {
        const response = await getJobApplicants(selectedJobId);
        setApplicants(response.data || []);
      }
    } catch (err) {
      setApplicantError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <section className="page-container employer-page">
      <div className="section-header">
        <div>
          <h2>Employer dashboard</h2>
          <p>Post jobs and manage your listings from the navbar options.</p>
        </div>
      </div>

      <div className="page-tabs">
        <button
          type="button"
          className={tab === "jobs" ? "tab active" : "tab"}
          onClick={() => setSearchParams({ tab: "jobs" })}
        >
          Jobs
        </button>
        <button
          type="button"
          className={tab === "applicants" ? "tab active" : "tab"}
          onClick={() => setSearchParams({ tab: "applicants" })}
        >
          Applicants
        </button>
        <button
          type="button"
          className={tab === "post" ? "tab active" : "tab"}
          onClick={() => setSearchParams({ tab: "post" })}
        >
          Add Job
        </button>
      </div>

      {tab === "jobs" ? (
        <div className="grid-list employer-list">
          {loading && <div className="info-box">Loading jobs...</div>}
          {!loading && jobs.length === 0 ? (
            <div className="info-box">No jobs posted yet.</div>
          ) : (
            jobs.map((job) => (
              <article key={job._id} className="list-card employer-card">
                <h3>{job.title}</h3>
                <p>{job.company?.name || "Company"} · {job.location}</p>
                <div className="status-row">
                  <span>Status</span>
                  <strong>{job.status}</strong>
                </div>
                <div className="job-meta">
                  <span>{job.type}</span>
                  <span>{job.workMode}</span>
                  <span>{job.openings} opening{job.openings > 1 ? "s" : ""}</span>
                </div>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => loadApplicants(job)}
                >
                  View applicants
                </button>
              </article>
            ))
          )}
        </div>
      ) : tab === "applicants" ? (
        <div className="applicants-shell">
          <div className="applicant-jobs-row grid-list">
            {jobs.length === 0 ? (
              <div className="info-box">No jobs available to manage yet.</div>
            ) : (
              jobs.map((job) => (
                <button
                  key={job._id}
                  type="button"
                  className={`list-card employer-card job-selector ${selectedJobId === job._id ? "active" : ""}`}
                  onClick={() => loadApplicants(job)}
                >
                  <h3>{job.title}</h3>
                  <p>{job.location}</p>
                  <div className="job-meta">
                    <span>{job.type}</span>
                    <span>{job.status}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="selected-applicants-panel">
            {selectedJobId ? (
              <>
                <h3>Applicants for {jobs.find((job) => job._id === selectedJobId)?.title}</h3>
                {applicantLoading ? (
                  <div className="info-box">Loading applicants...</div>
                ) : applicantError ? (
                  <div className="error-box">{applicantError}</div>
                ) : applicants.length === 0 ? (
                  <div className="info-box">No applications submitted for this job yet.</div>
                ) : (
                  <div className="grid-list applicant-list">
                    {applicants.map((application) => (
                      <article key={application._id} className="list-card admin-card">
                        <h3>{application.candidate?.fullName || "Candidate"}</h3>
                        <p>{application.candidate?.email}</p>
                        <div className="meta-row">
                          <span>{application.status === "hired" ? "Accepted" : application.status || "Pending"}</span>
                          <span>{application.job?.title}</span>
                        </div>
                        {application.candidate?.candidateProfile?.headline && (
                          <p className="candidate-headline">{application.candidate.candidateProfile.headline}</p>
                        )}
                        {application.resumeUrl && (
                          <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="link-button">
                            View resume
                          </a>
                        )}
                        <div className="button-row">
                          <button
                            type="button"
                            className="button secondary"
                            disabled={statusLoading || application.status === "hired"}
                            onClick={() => handleStatusChange(application._id, "hired")}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="button secondary"
                            disabled={statusLoading || application.status === "rejected"}
                            onClick={() => handleStatusChange(application._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="info-box">Select a job above to review applicant submissions.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="form-card employer-form-card">
          <h3>Post a new job</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Job title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} required />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} required />
            </label>
            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>full-time</option>
                <option>part-time</option>
                <option>contract</option>
                <option>internship</option>
              </select>
            </label>
            <label>
              Work mode
              <select name="workMode" value={form.workMode} onChange={handleChange}>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>onsite</option>
              </select>
            </label>
            <label>
              Requirements (comma separated)
              <input name="requirements" value={form.requirements} onChange={handleChange} />
            </label>
            <label>
              Skills (comma separated)
              <input name="skills" value={form.skills} onChange={handleChange} />
            </label>
            <label>
              Minimum experience
              <input name="minExperience" value={form.minExperience} onChange={handleChange} type="number" min="0" />
            </label>
            <label>
              Salary min
              <input name="salaryMin" value={form.salaryMin} onChange={handleChange} type="number" />
            </label>
            <label>
              Salary max
              <input name="salaryMax" value={form.salaryMax} onChange={handleChange} type="number" />
            </label>
            <label>
              Openings
              <input name="openings" value={form.openings} onChange={handleChange} type="number" min="1" />
            </label>
            <label>
              Deadline
              <input name="deadline" value={form.deadline} onChange={handleChange} type="date" />
            </label>
            {success && <div className="success-box">{success}</div>}
            {error && <div className="error-box">{error}</div>}
            <button className="button" type="submit">
              Publish job
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
