// src/pages/Fertilizers.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Fertilizers() {
  const [fertilizers, setFertilizers] = useState([])
  const [newName, setNewName] = useState("")
  const [newInterval, setNewInterval] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFertilizers()
  }, [])

  const fetchFertilizers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("duengemittel")
      .select("*")
      .order("created_at", { ascending: true })

    if (!error) setFertilizers(data)
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newName || !newInterval) return
  
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      alert("Nicht eingeloggt!")
      return
    }
  
    const { error } = await supabase.from("duengemittel").insert({
      name: newName,
      duengeintervall_tage: parseInt(newInterval),
      user_id: user.id     // 👈 hier fügen wir die user_id korrekt hinzu
    })
  
    if (!error) {
      setNewName("")
      setNewInterval("")
      fetchFertilizers()
    } else {
      alert("Fehler beim Anlegen des Düngemittels.")
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm("Düngemittel wirklich löschen?")) return
    await supabase.from("duengemittel").delete().eq("id", id)
    fetchFertilizers()
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">🌿 Meine Düngemittel</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">➕ Neues Düngemittel hinzufügen</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name (z. B. Flüssigdünger)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Intervall (Tage)"
              value={newInterval}
              onChange={(e) => setNewInterval(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={handleAdd}>
              Speichern
            </button>
          </div>
        </div>
      </div>

      <h5 className="fw-semibold mb-3">🌱 Angelegte Düngemittel</h5>

      {loading ? (
        <p>Lade...</p>
      ) : fertilizers.length === 0 ? (
        <p className="text-muted">Noch keine Düngemittel angelegt.</p>
      ) : (
        <ul className="list-group">
          {fertilizers.map((f) => (
            <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {f.name} <span className="text-muted small">({f.duengeintervall_tage} Tage)</span>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
