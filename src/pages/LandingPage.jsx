import { Link } from "react-router-dom"
import "./LandingPage.css"

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="logo">🌿 GrowMate</h1>
        <div>
          <Link to="/auth" className="btn btn-outline-success me-2">Login</Link>
          <Link to="/auth" className="btn btn-success">Registrieren</Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-text">
          <h2 className="display-5 fw-bold">Dein smarter Pflanzen-Planer</h2>
          <p className="lead">
            Pflege deine Pflanzen mit Leichtigkeit. Behalte Gieß-, Dünge- und Umtopfzeiten im Blick – ganz automatisch. 🌱📅
          </p>
          <Link to="/auth" className="btn btn-lg btn-success mt-3">Jetzt starten</Link>
        </div>
        <div className="hero-image">
        <img src="/illustration_growmate.png" alt="GrowMate Illustration" />

        </div>
      </section>

      <footer className="text-center text-muted small py-4">
  © {new Date().getFullYear()} GrowMate · entwickelt mit 💚 von elo.systems <br />
  <a href="/impressum" className="text-muted me-2">Impressum</a>
  <a href="/datenschutz" className="text-muted">Datenschutz</a>
</footer>

    </div>
  )
}
