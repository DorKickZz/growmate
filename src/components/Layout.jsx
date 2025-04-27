import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaHome, FaCalendarAlt, FaLeaf, FaFlask, FaGift } from "react-icons/fa";
import "./Layout.css";

export default function Layout({ children, onLogout }) {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Zustand für das Öffnen des Menüs

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  return (
    <>
      <header className="layout-header">
        <h4 className="logo">🌿 GrowMate</h4>

        {/* Hamburger-Icon */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <FaHome /> Dashboard
          </Link>
          <Link to="/kalender" className={location.pathname === "/kalender" ? "active" : ""}>
            <FaCalendarAlt /> Kalender
          </Link>
          <Link to="/pflanzen" className={location.pathname === "/pflanzen" ? "active" : ""}>
            <FaLeaf /> Meine Pflanzen
          </Link>
          <Link to="/duengemittel" className={location.pathname === "/duengemittel" ? "active" : ""}>
            <FaFlask /> Düngemittel
          </Link>
          <Link to="/wunschliste" className={location.pathname === "/wunschliste" ? "active" : ""}>
            <FaGift /> Wunschliste
          </Link>
          <span className="user-email">{userEmail}</span>
          <button className="btn btn-sm btn-danger" onClick={onLogout}>Logout</button>
        </nav>
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
