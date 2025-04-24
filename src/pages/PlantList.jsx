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
    const { data } = await supabase
      .from("pflanzen")
      .select("*")
      .eq("user_id", uid)
    setPlants(data || [])
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

  const markAction = async (plantId, field, value = new Date().toISOString().split("T")[0]) => {
    await supabase
      .from("pflanzen")
      .update({ [field]: value })
      .eq("id", plantId)
    refreshPlants()
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h2 className="fw-bold mb-0">🌿 Meine Pflanzen</h2>
        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
          ➕ Neue Pflanze
        </button>
      </div>

      {plants.length === 0 ? (
        <p className="text-muted text-center">Noch keine Pflanzen eingetragen.</p>
      ) : (
        <div className="row g-4">
          {plants.map((plant) => (
            <div className="col-12 col-md-6 col-lg-4" key={plant.id}>
              <div className="card shadow-sm h-100 p-3 d-flex flex-column">
                {plant.photo_url && (
                  <img
                    src={plant.photo_url}
                    alt={plant.name}
                    className="img-fluid rounded mb-3"
                    style={{ objectFit: "cover", maxHeight: "180px", width: "100%" }}
                    data-bs-toggle="modal"
                    data-bs-target={`#plantModal-${plant.id}`}
                  />
                )}

                <h5 className="fw-semibold">{plant.name}</h5>
                <p className="text-secondary small mb-2">
  Kategorie: <strong>{plant.category || "–"}</strong><br />
  Standort: {plant.location || "–"}
</p>


                <div className="d-flex flex-wrap gap-2 mb-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => markAction(plant.id, "last_watered")}>
                    💧 Gegossen
                  </button>
                  <button className="btn btn-outline-success btn-sm" onClick={() => setFertilizingPlant(plant)}>
                    🧪 Gedüngt
                  </button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => markAction(plant.id, "repotting_needed", true)}>
                    🔁 Umtopfen nötig
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-auto">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setViewingNotes(plant)}>
                    💬 Notiz
                  </button>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setEditingPlant(plant)}>
                    📝 Bearbeiten
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(plant.id)}>
                    🗑️ Löschen
                  </button>
                </div>

                {plant.notes && (
                  <p className="text-muted small mt-2">
                  💬 Letzte Notiz: <em>{plant.notes || "Keine Notiz vorhanden"}</em>
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

      {showCreate && <PlantCreateModal onClose={() => setShowCreate(false)} onCreated={() => refreshPlants()} />}
      {editingPlant && <PlantEditModal plant={editingPlant} onClose={() => setEditingPlant(null)} onSave={handleSaveEdit} />}
      {fertilizingPlant && <FertilizeModal plant={fertilizingPlant} onClose={() => setFertilizingPlant(null)} onFertilized={() => refreshPlants()} />}
      {viewingNotes && <NotesModal plant={viewingNotes} onClose={() => setViewingNotes(null)} onSaved={() => refreshPlants()} />}
    </div>
  )
}
