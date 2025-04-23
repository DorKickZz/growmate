import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function NotesModal({ plant, onClose }) {
  const [duengeeintraege, setDuengeeintraege] = useState([])

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

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div className="bg-white rounded-4 shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🧾 Pflegeverlauf: {plant.name}</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        {plant.notes && (
          <div className="mb-3">
            <strong>Notizen:</strong>
            <p className="mb-0">{plant.notes}</p>
          </div>
        )}

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
