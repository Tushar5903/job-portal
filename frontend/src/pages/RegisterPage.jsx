import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./RegisterPage.css";

const candidateFields = [
  { name: "headline", label: "Headline" },
  { name: "location", label: "Location" },
  { name: "phone", label: "Phone" },
  { name: "skills", label: "Skills (comma separated)" },
  { name: "experienceYears", label: "Experience years" },
  { name: "education", label: "Education" },
];

const employerFields = [
  { name: "companyName", label: "Company name" },
  { name: "website", label: "Website" },
  { name: "industry", label: "Industry" },
  { name: "size", label: "Company size" },
  { name: "location", label: "Company location" },
  { name: "designation", label: "Designation" },
  { name: "phone", label: "Phone" },
  { name: "description", label: "Company description" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "candidate",
    headline: "",
    location: "",
    phone: "",
    skills: "",
    experienceYears: "",
    education: "",
    companyName: "",
    website: "",
    industry: "",
    size: "",
    description: "",
    adminSetupKey: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await register(form);
      const role = response.data.user.role;
      navigate(
        role === "admin"
          ? "/admin"
          : role === "employer"
            ? "/employer"
            : "/candidate",
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-container form-shell">
      <div className="form-card">
        <h2>Create account</h2>
        <p>Select the role that fits you and complete the form.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
            />
          </label>
          <label className="full-span">
            Password
            <div className="password-input-container">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </label>

          {form.role === "candidate" && (
            <>
              {candidateFields.map((field) => (
                <label key={field.name}>
                  {field.label}
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                </label>
              ))}
            </>
          )}

          {form.role === "employer" && (
            <>
              {employerFields.map((field) => (
                <label key={field.name}>
                  {field.label}
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                </label>
              ))}
            </>
          )}

          {form.role === "admin" && (
            <label>
              Admin setup key
              <input
                name="adminSetupKey"
                value={form.adminSetupKey}
                onChange={handleChange}
              />
            </label>
          )}

          {error && <div className="error-box full-span">{error}</div>}
          <button className="button full-span" type="submit">
            Register
          </button>
        </form>
      </div>
    </section>
  );
}
