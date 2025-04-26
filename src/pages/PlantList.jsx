// src/pages/PlantList.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import PlantCreateModal from "../components/PlantCreateModal"
import PlantEditModal from "../components/PlantEditModal"
import FertilizeModal from "../components/FertilizeModal"
import NotesModal from "../components/NotesModal"

export default function PlantList() {
  const [plants, setPlants] = useState([])
  const [editingPlant, setEditingPlant] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [fertilizingPlant, setFertilizingPlant] = useState(null)
  const [viewingNotes, setViewingNotes] = useState(null)
  const [userId, setUserId] = useState(null)

  const [sortField, setSortField] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUserAndPlants = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        refreshPlants(user.id)
      }
    }

    fetchUserAndPlants()
  }, [])

  const refreshPlants = async (uid = userId) => {
    if (!uid) return
    const { data, error } = await supabase
      .from("pflanzen")
      .select("*")
      .eq("user_id", uid)
    if (!error) setPlants(data)
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

    const { id, name, category, location, water_interval, fertilizer_interval, photo_url } = plant
    await supabase
      .from("pflanzen")
      .update({ name, category, location, water_interval, fertilizer_interval, photo_url })
      .eq("id", id)
    setEditingPlant(null)
    refreshPlants()
  }

  const markAction = async (plantId, field, value = new Date().toISOString().split("T")[0]) => {
    const { error } = await supabase
      .from("pflanzen")
      .update({ [field]: value })
      .eq("id", plantId)

    if (!error) refreshPlants()
  }

  const filteredAndSortedPlants = plants
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (!a[sortField] || !b[sortField]) return 0
      return a[sortField].localeCompare(b[sortField])
    })

  return (
    <div className="container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h2 className="fw-semibold mb-0">🌿 Meine Pflanzen</h2>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: "200px" }}
          />
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Sortieren nach: Name</option>
            <option value="location">Sortieren nach: Standort</option>
            <option value="category">Sortieren nach: Kategorie</option>
          </select>
          <button className="btn btn-success" onClick={() => setShowCreate(true)}>
            ➕ Neue Pflanze
          </button>
        </div>
      </div>

      {filteredAndSortedPlants.length === 0 ? (
        <p className="text-muted">Keine Pflanzen gefunden.</p>
      ) : (
        <div className="row g-4">
          {filteredAndSortedPlants.map((plant) => (
            <div className="col-12 col-sm-6 col-md-4" key={plant.id}>
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
                  Kategorie: <strong>{plant.category || "-"}</strong><br />
                  Standort: {plant.location || "-"}
                </p>

                <div className="d-flex gap-2 flex-wrap mt-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => markAction(plant.id, "last_watered")}>
                    💧 Gegossen
                  </button>
                  <button className="btn btn-sm btn-outline-success" onClick={() => setFertilizingPlant(plant)}>
                    🧪 Gedüngt
                  </button>
                  <button className="btn btn-sm btn-outline-warning" onClick={() => markAction(plant.id, "repotting_needed", true)}>
                    🔁 Umtopfen nötig
                  </button>
                </div>

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setViewingNotes(plant)}>
                    💬 Notiz
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingPlant(plant)}>
                    📝 Bearbeiten
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plant.id)}>
                    🗑️ Löschen
                  </button>
                </div>

                {plant.notes && (
                  <p className="text-muted small mt-2">
                    💬 Letzte Notiz: <em>{plant.notes}</em>
                  </p>
                )}
              </div>

              {/* Modal für großes Bild */}
              <div className="modal fade" id={`plantModal-${plant.id}`} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content bg-dark text-white border-0">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">{plant.name}</h5>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body text-center">
                      <img src={plant.photo_url} alt={plant.name} className="img-fluid rounded shadow" style={{ maxHeight: "75vh" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <PlantCreateModal onClose={() => setShowCreate(false)} onCreated={() => refreshPlants()} />
      )}
      {editingPlant && (
        <PlantEditModal plant={editingPlant} onClose={() => setEditingPlant(null)} onSave={handleSaveEdit} />
      )}
      {fertilizingPlant && (
        <FertilizeModal plant={fertilizingPlant} onClose={() => setFertilizingPlant(null)} onFertilized={() => refreshPlants()} />
      )}
      {viewingNotes && (
        <NotesModal plant={viewingNotes} onClose={() => setViewingNotes(null)} onSaved={() => refreshPlants()} />
      )}
    </div>
  )
}
