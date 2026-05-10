import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./ProfilePage.css";

const INITIAL_STATE = {
  headline: "",
  location: "",
  phone: "",
  education: "",
  skills: "",
  experienceYears: "",
};

export default function ProfilePage() {
  const { user, updateProfile, uploadResume } = useAuth();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData({
      headline: user.candidateProfile?.headline || "",
      location: user.candidateProfile?.location || "",
      phone: user.candidateProfile?.phone || "",
      education: user.candidateProfile?.education || "",
      skills: (user.candidateProfile?.skills || []).join(", "),
      experienceYears: user.candidateProfile?.experienceYears || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await updateProfile(formData);
      setStatus({ type: "success", message: "Profile saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Unable to save profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      setResumeStatus({ type: "error", message: "Please select a resume file to upload." });
      return;
    }

    setResumeLoading(true);
    setResumeStatus(null);

    try {
      await uploadResume(resumeFile);
      setResumeStatus({ type: "success", message: "Resume uploaded successfully." });
      setResumeFile(null);
    } catch (err) {
      setResumeStatus({ type: "error", message: err.message || "Resume upload failed." });
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <section className="page-container profile-page">
      <div className="section-header">
        <div>
          <h2>Candidate Profile</h2>
          <p>Update your details, upload a resume, and keep your profile ready for applications.</p>
        </div>
      </div>

      <div className="form-card profile-card">
        <div className="profile-meta">
          <div>
            <p className="muted-label">Account</p>
            <h3>{user?.fullName || "Candidate"}</h3>
            <p>{user?.email}</p>
          </div>
          <span className="role-pill">{user?.role || "candidate"}</span>
        </div>

        {status?.message && (
          <div className={status.type === "success" ? "success-box" : "error-box"}>
            {status.message}
          </div>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Headline
            <input
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Experienced frontend developer"
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </label>

          <label>
            Education
            <input
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="MSc Computer Science"
            />
          </label>

          <label>
            Skills
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, SQL"
            />
          </label>

          <label>
            Years of experience
            <input
              name="experienceYears"
              type="number"
              min="0"
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="3"
            />
          </label>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Saving..." : "Save profile"}
          </button>
        </form>

        <div className="resume-panel">
          <div className="resume-meta">
            <h3>Resume</h3>
            <p className="small-text">Upload your latest resume here so applications can be submitted quickly.</p>
            {user?.candidateProfile?.resumeUrl && (
              <a href={user.candidateProfile.resumeUrl} target="_blank" rel="noreferrer" className="link-button">
                View current resume
              </a>
            )}
          </div>

          {resumeStatus?.message && (
            <div className={resumeStatus.type === "success" ? "success-box" : "error-box"}>
              {resumeStatus.message}
            </div>
          )}

          <form className="resume-form" onSubmit={handleResumeUpload}>
            <label>
              Upload resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
              />
            </label>
            <button type="submit" className="button secondary" disabled={resumeLoading}>
              {resumeLoading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
