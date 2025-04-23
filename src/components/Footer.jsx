// src/components/Footer.jsx
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="text-center text-muted small py-4 mt-auto">
      © {new Date().getFullYear()} GrowMate · entwickelt mit 💚 von elo.systems <br />
      <Link to="/impressum" className="text-muted me-3">Impressum</Link>
      <Link to="/datenschutz" className="text-muted">Datenschutz</Link>
    </footer>
  )
}
