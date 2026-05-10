import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await login(form);
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
        <h2>Login</h2>
        <p>Access your candidate, employer, or admin dashboard securely.</p>
        <form onSubmit={handleSubmit}>
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
          <label>
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
          {error && <div className="error-box">{error}</div>}
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
