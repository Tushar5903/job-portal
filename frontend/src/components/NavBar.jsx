import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./NavBar.css";

const getInitials = (fullName) => {
  const matches = fullName?.match(/\b\w/g) || [];
  return matches.slice(0, 2).join("").toUpperCase() || "ME";
};

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const profilePath = user?.role === "candidate"
    ? "/profile"
    : user?.role === "employer"
      ? "/employer"
      : user?.role === "admin"
        ? "/admin"
        : "/";

  return (
    <header className="topbar">
      <div className="brand">
        <NavLink to="/" className="brand-link">
          Job Portal
        </NavLink>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
          Home
        </NavLink>
        {!user && (
          <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
            Login
          </NavLink>
        )}
        {!user && (
          <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
            Register
          </NavLink>
        )}
        {user?.role === "candidate" && (
          <>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
              Profile
            </NavLink>
            <NavLink to="/candidate" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
              Applications
            </NavLink>
          </>
        )}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link") }>
            Admin
          </NavLink>
        )}
      </nav>
      {user ? (
        <div className="user-actions">
          <NavLink to={profilePath} className="user-avatar" title="Profile">
            {getInitials(user.fullName)}
          </NavLink>
          <button className="button secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}
