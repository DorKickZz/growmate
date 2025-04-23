import { Link } from "react-router-dom"

export default function Datenschutz() {
  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Zurück zur Startseite
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="fw-bold mb-3">Datenschutzerklärung</h2>
        <p>
          Wir nehmen den Schutz deiner persönlichen Daten sehr ernst.
          Diese Anwendung speichert ausschließlich die Informationen, die für die Nutzung notwendig sind.
        </p>

        <h5 className="mt-4">1. Verantwortlicher</h5>
        <p>
          Felix Jähnichen<br />
          Goldbacher Weg 7<br />
          01877 Bischofswerda<br />
          kontakt@growmate.de
        </p>

        <h5 className="mt-4">2. Datenverarbeitung</h5>
        <p>
          Es werden nur Daten gespeichert, die du selbst einträgst (z. B. Pflanzendaten, Gießdaten). Diese Daten sind nur für dich sichtbar.
        </p>

        <h5 className="mt-4">3. Rechte</h5>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten.
        </p>

        <h5 className="mt-4">4. Kontakt</h5>
        <p>
          Für Fragen zum Datenschutz kontaktiere uns gern: kontakt@growmate.de
        </p>
      </div>
    </div>
  )
}
