import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function NotesModal({ plant, onClose, onSaved }) {
  const [duengeeintraege, setDuengeeintraege] = useState([])
  const [newNote, setNewNote] = useState(plant.notes || "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("duengeeintraege")
        .select("*")
        .eq("pflanze_id", plant.id)
        .order("datum", { ascending: false })

      if (!error) setDuengeeintraege(data)
    }

    fetchEntries()
  }, [plant.id])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from("pflanzen")
      .update({ notes: newNote })
      .eq("id", plant.id)

    setSaving(false)
    if (!error) {
      onSaved?.()
      onClose()
    } else {
      console.error("Fehler beim Speichern der Notiz:", error)
    }
  }

  return (
    <div
  className="position-fixed top-0 start-0 w-100 h-100"
  style={{
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050,
    overflowY: "auto",     // 👈 das macht's scrollbar
    padding: "2rem",        // 👈 damit es oben und unten Luft hat
  }}
>
  <div className="bg-white rounded-4 shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🧾 Pflegeverlauf: {plant.name}</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">📝 Notiz</label>
          <textarea
            className="form-control"
            rows="3"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Hier kannst du eine neue Notiz eintragen …"
          />
        </div>

        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-secondary me-2" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-success" onClick={handleSave} disabled={saving}>
            {saving ? "Speichert…" : "Speichern"}
          </button>
        </div>

        <div>
          <strong>Letzte Düngungen:</strong>
          <ul className="list-unstyled mt-2">
            {duengeeintraege.length === 0 ? (
              <li className="text-muted">Keine Einträge vorhanden.</li>
            ) : (
              duengeeintraege.map((entry) => (
                <li key={entry.id}>
                  🧪 {entry.menge ?? "ohne Angabe"} am{" "}
                  {new Date(entry.datum).toLocaleDateString("de-DE")}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
