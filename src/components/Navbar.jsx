import { NavLink } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaLeaf, FaFlask, FaGift, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2 px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo + Brand */}
        <div className="d-flex align-items-center gap-2">
          <img src="/growmate-icon.png" alt="GrowMate" style={{ height: "32px" }} />
          <span className="fw-bold text-success fs-4">GrowMate</span>
        </div>

        {/* Navigation Links */}
        <div className="d-flex align-items-center gap-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-success' : 'text-secondary'}`}
          >
            <FaHome className="me-1" />
            Dashboard
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-success' : 'text-secondary'}`}
          >
            <FaCalendarAlt className="me-1" />
            Kalender
          </NavLink>

          <NavLink
            to="/plants"
            className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-success' : 'text-secondary'}`}
          >
            <FaLeaf className="me-1" />
            Meine Pflanzen
          </NavLink>

          <NavLink
            to="/fertilizers"
            className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-success' : 'text-secondary'}`}
          >
            <FaFlask className="me-1" />
            Düngemittel
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-success' : 'text-secondary'}`}
          >
            <FaGift className="me-1" />
            Wunschliste
          </NavLink>

          {/* User Info + Logout */}
          {user && (
            <>
              <span className="text-muted small">{user.email}</span>
              <button onClick={onLogout} className="btn btn-danger btn-sm">
                <FaSignOutAlt className="me-1" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
