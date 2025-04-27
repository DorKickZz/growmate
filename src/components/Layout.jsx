import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaLeaf, FaFlask, FaGift, FaSignOutAlt } from "react-icons/fa";
import "./Layout.css";

export default function Layout({ children, onLogout }) {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  return (
    <>
      <header className="layout-header shadow-sm bg-white p-2">
        <div className="d-flex justify-content-between align-items-center container">
          {/* Logo */}
          <h4 className="logo">🌿 GrowMate</h4>


          {/* Navigation */}
          <nav className="nav-links d-flex align-items-center gap-3">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <FaHome className="me-1" /> Dashboard
            </Link>
            <Link to="/kalender" className={location.pathname === "/kalender" ? "active" : ""}>
              <FaCalendarAlt className="me-1" /> Kalender
            </Link>
            <Link to="/pflanzen" className={location.pathname === "/pflanzen" ? "active" : ""}>
              <FaLeaf className="me-1" /> Meine Pflanzen
            </Link>
            <Link to="/duengemittel" className={location.pathname === "/duengemittel" ? "active" : ""}>
              <FaFlask className="me-1" /> Düngemittel
            </Link>
            <Link to="/wunschliste" className={location.pathname === "/wunschliste" ? "active" : ""}>
              <FaGift className="me-1" /> Wunschliste
            </Link>

            {/* User-Email + Logout */}
            <span className="user-email text-muted small">{userEmail}</span>
            <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container py-4">{children}</main>

      <footer className="text-center text-muted py-4 small mt-5">
        <div className="mb-2">
          <Link to="/impressum" className="text-muted me-3">Impressum</Link>
          <Link to="/datenschutz" className="text-muted">Datenschutz</Link>
        </div>
        <div>
          GrowMate © {new Date().getFullYear()} – mit 💚 gepflegt
        </div>
      </footer>
    </>
  );
}
