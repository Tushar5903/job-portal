import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactTyped as Typed } from "react-typed";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getJobs } from "../api/api.js";
import "./HomePage.css";

const DEFAULT_JOB_TYPES = ["all", "Full-time", "Part-time", "Contract", "Internship"];
const DEFAULT_WORK_MODES = ["all", "Onsite", "Remote", "Hybrid"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await getJobs("?limit=20");
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const rawText = `${job.title || ""} ${job.company?.name || ""} ${job.location || ""}`.toLowerCase();
    const query = searchText.trim().toLowerCase();
    const matchesSearch = !query || rawText.includes(query);
    const matchesType = typeFilter === "all" || (job.type || "").toLowerCase() === typeFilter.toLowerCase();
    const matchesMode = modeFilter === "all" || (job.workMode || "").toLowerCase() === modeFilter.toLowerCase();
    return matchesSearch && matchesType && matchesMode;
  });

  return (
    <section className="page-container home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Open job portal</p>
            <h1>
              <Typed
                strings={[
                  "Discover jobs that match your experience and goals.",
                  "Discover roles that fit your skills and ambitions.",
                ]}
                typeSpeed={60}
                backSpeed={35}
                loop
              />
            </h1>
            <p className="hero-copy">
              Browse active positions across companies, filter by role, and apply with your profile.
            </p>
            {!user && (
              <div className="hero-actions">
                <Link to="/register" className="button">
                  Get Started
                </Link>
                <Link to="/login" className="button secondary">
                  Login
                </Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1768839724944-6f7101c5a4da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGpvYiUyMHBvcnRhbHxlbnwwfHwwfHx8MA%3D%3D" alt="Team collaboration" />
          </div>
        </div>
        <div className="floating-elements">
          <div className="float-1"></div>
          <div className="float-2"></div>
          <div className="float-3"></div>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2>Latest jobs</h2>
          <p>Search, filter, and explore the newest active listings from employers.</p>
        </div>
      </div>

      <div className="search-panel">
        <div className="search-field">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search roles, companies, or locations"
          />
        </div>
        <div className="search-filters">
          <label>
            Job type
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              {DEFAULT_JOB_TYPES.map((type) => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Work mode
            <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value)}>
              {DEFAULT_WORK_MODES.map((mode) => (
                <option key={mode} value={mode.toLowerCase()}>{mode}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading && <div className="info-box">Loading jobs...</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="jobs-wrapper">
        <div className="jobs-summary">
          {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} found
          {searchText || typeFilter !== "all" || modeFilter !== "all" ? " for your filters" : ""}
        </div>

        <div className="grid-list">
          {filteredJobs.length === 0 && !loading ? (
            <div className="info-box">No jobs match your search and filters.</div>
          ) : (
            filteredJobs.map((job) => (
              <article key={job._id} className="job-card">
                <div className="job-card-top">
                  <span className="job-type">{job.type || "Job"}</span>
                  <span className="job-status">{job.status || "Open"}</span>
                </div>
                <h3>{job.title}</h3>
                <p className="job-company">{job.company?.name || "Company"}</p>
                <p className="job-location">{job.location || "Remote"}</p>
                <div className="job-meta">
                  <span>{job.workMode || "Onsite"}</span>
                  <span>{job.experienceLevel || "Entry"}</span>
                </div>
                <Link to={`/jobs/${job._id}`} className="button small">
                  View details
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

