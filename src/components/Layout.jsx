// src/components/Layout.jsx
import { Link, useLocation } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"
import "./Layout.css"


export default function Layout({ children, onLogout }) {
  const location = useLocation()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email)
    }
    fetchUser()
  }, [])

  return (
    <>
      <header className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white shadow-sm">
        <h4 className="m-0 text-success fw-bold">GrowMate</h4>
        <nav className="d-flex gap-3 align-items-center">
          <Link to="/" className={location.pathname === "/" ? "fw-bold text-dark" : "text-muted"}>
            Dashboard
          </Link>
          <Link to="/kalender" className={location.pathname === "/kalender" ? "fw-bold text-dark" : "text-muted"}>
            Kalender
          </Link>
          <Link to="/pflanzen" className={location.pathname === "/pflanzen" ? "fw-bold text-dark" : "text-muted"}>
            Pflanzenliste
          </Link>
          <div className="vr mx-2" />
          <span className="text-muted small">{userEmail}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={onLogout}>Logout</button>
        </nav>
      </header>

      <main className="container py-4">{children}</main>

      <footer className="text-center text-muted py-4 small">
  GrowMate © {new Date().getFullYear()} – mit 💚 gepflegt<br />
  <Link to="/impressum" className="text-muted me-3 footer-link">Impressum</Link>
<Link to="/datenschutz" className="text-muted footer-link">Datenschutz</Link>

</footer>

    </>
  )
}
