import { Link } from "react-router-dom"

export default function Impressum() {
  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Zurück zur Startseite
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="fw-bold mb-3">Impressum</h2>
        <p><strong>GrowMate – Smarter Pflanzen-Planer</strong></p>
        <p>Verantwortlich gemäß § 5 TMG:</p>
        <p>
          Felix Jähnichen<br />
          Goldbacher Weg 7<br />
          01877 Bischofswerda<br />
          Deutschland<br />
          E-Mail: kontakt@growmate.de
        </p>
        <p>Inhaltlich verantwortlich: Felix Jähnichen</p>
      </div>
    </div>
  )
}
