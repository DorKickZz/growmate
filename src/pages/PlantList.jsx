import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import PlantCreateModal from "../components/PlantCreateModal"
import PlantEditModal from "../components/PlantEditModal"
import FertilizeModal from "../components/FertilizeModal"

export default function PlantList() {
  const [plants, setPlants] = useState([])
  const [editingPlant, setEditingPlant] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [fertilizingPlant, setFertilizingPlant] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserAndPlants = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data, error } = await supabase
          .from("pflanzen")
          .select("*")
          .eq("user_id", user.id)
        if (!error) setPlants(data)
      }
    }

    fetchUserAndPlants()
  }, [])

  const refreshPlants = async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from("pflanzen")
      .select("*")
      .eq("user_id", userId)
    if (!error) setPlants(data)
  }

  const markAction = async (plantId, field) => {
    const today = new Date().toISOString().split("T")[0]
    const { error } = await supabase
      .from("pflanzen")
      .update({ [field]: today })
      .eq("id", plantId)

    if (!error) refreshPlants()
  }

  const handleDelete = async (id) => {
    if (!confirm("Möchtest du diese Pflanze wirklich löschen?")) return
    await supabase.from("pflanzen").delete().eq("id", id)
    refreshPlants()
  }

  const handleSaveEdit = async (plant, shouldSave) => {
    if (!shouldSave) {
      setEditingPlant(null)
      return
    }

    const { id, name, category, location, water_interval, fertilizer_interval } = plant
    await supabase
      .from("pflanzen")
      .update({ name, category, location, water_interval, fertilizer_interval })
      .eq("id", id)
    setEditingPlant(null)
    refreshPlants()
  }

  const handleSaveNote = async () => {
    const { error } = await supabase
      .from("pflanzen")
      .update({ notes: noteText })
      .eq("id", editingNote.id)

    if (!error) {
      setEditingNote(null)
      setNoteText("")
      refreshPlants()
    } else {
      console.error("Fehler beim Speichern der Notiz:", error)
    }
  }

  const getDueStatus = (plant) => {
    const today = new Date()
    const getDiff = (dateStr) => {
      if (!dateStr) return Infinity
      const date = new Date(dateStr)
      const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24))
      return diff
    }

    const wateringDue = plant.water_interval && getDiff(plant.last_watered) >= plant.water_interval
    const fertilizingDue = plant.fertilizer_interval && getDiff(plant.last_fertilized) >= plant.fertilizer_interval
    return { wateringDue, fertilizingDue }
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold">🌿 Deine Pflanzen</h2>
        <button className="btn btn-outline-success" onClick={() => setShowCreate(true)}>➕ Neue Pflanze</button>
      </div>

      {plants.length === 0 ? (
        <p className="text-muted">Keine Pflanzen vorhanden.</p>
      ) : (
        <div className="row g-4">
          {plants.map((plant) => {
            const { wateringDue, fertilizingDue } = getDueStatus(plant)
            return (
              <div className="col-md-4" key={plant.id}>
                <div className="card p-3 h-100 shadow-sm d-flex flex-column">
                  {plant.photo_url && (
                    <img
                      src={plant.photo_url}
                      alt={plant.name}
                      className="img-thumbnail mb-2"
                      style={{ cursor: "zoom-in", maxHeight: "150px", objectFit: "cover" }}
                      data-bs-toggle="modal"
                      data-bs-target={`#plantModal-${plant.id}`}
                    />
                  )}
                  <h5 className="fw-semibold">{plant.name}</h5>
                  <p className="text-secondary small mb-2">
                    Kategorie: <strong>{plant.category}</strong><br />
                    Standort: {plant.location}
                    Kategorie: <strong>{plant.category}</strong><br />
  Standort: {plant.location}<br />
  {plant.last_watered && <>💧 Zuletzt gegossen: {new Date(plant.last_watered).toLocaleDateString()}</>}<br />
  {plant.last_fertilized && <>🧪 Zuletzt gedüngt: {new Date(plant.last_fertilized).toLocaleDateString()}</>}<br />
  {plant.last_repotted && <>🔁 Zuletzt umgetopft: {new Date(plant.last_repotted).toLocaleDateString()}</>}
                  </p>


                  {wateringDue && <p className="text-danger small">💧 Gießen fällig</p>}
                  {fertilizingDue && <p className="text-warning small">🧪 Düngung fällig</p>}

                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => markAction(plant.id, "last_watered")}>💧 Gegossen</button>
                    <button className="btn btn-sm btn-outline-success" onClick={() => setFertilizingPlant(plant)}>🧪 Gedüngt</button>
                    <button className="btn btn-sm btn-outline-warning" onClick={() => markAction(plant.id, "last_repotted")}>🔁 Umtopfen</button>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-sm btn-outline-info" onClick={() => { setEditingNote(plant); setNoteText(plant.notes || "") }}>📝 Notizen</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingPlant(plant)}>Bearbeiten</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plant.id)}>🗑️ Löschen</button>
                  </div>
                </div>

                {/* Modal zum Vergrößern */}
                <div className="modal fade" id={`plantModal-${plant.id}`} tabIndex="-1">
                  <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content bg-dark text-white border-0">
                      <div className="modal-header border-0">
                        <h5 className="modal-title">{plant.name}</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body text-center">
                        <img src={plant.photo_url} alt={plant.name} className="img-fluid rounded shadow" style={{ maxHeight: "75vh" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && <PlantCreateModal onClose={() => setShowCreate(false)} onCreated={refreshPlants} />}
      {editingPlant && <PlantEditModal plant={editingPlant} onClose={() => setEditingPlant(null)} onSave={handleSaveEdit} />}
      {fertilizingPlant && <FertilizeModal plant={fertilizingPlant} onClose={() => setFertilizingPlant(null)} onFertilized={refreshPlants} />}

      {editingNote && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">📝 Notiz bearbeiten</h5>
                <button className="btn-close" onClick={() => setEditingNote(null)} />
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={5}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingNote(null)}>Abbrechen</button>
                <button className="btn btn-success" onClick={handleSaveNote}>Speichern</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
