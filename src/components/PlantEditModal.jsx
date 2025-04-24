import { useState, useEffect } from "react"

export default function PlantEditModal({ plant, onClose, onSave }) {
  const [editedPlant, setEditedPlant] = useState({ ...plant })

  useEffect(() => {
    setEditedPlant({ ...plant })
  }, [plant])

  const handleChange = (field, value) => {
    setEditedPlant((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    onSave(editedPlant, true)
  }

  if (!plant) return null

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
          <h5 className="mb-0">📝 Pflanze bearbeiten</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={editedPlant.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kategorie</label>
          <input
            type="text"
            className="form-control"
            value={editedPlant.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Standort</label>
          <input
            type="text"
            className="form-control"
            value={editedPlant.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gießintervall (Tage)</label>
          <input
            type="number"
            className="form-control"
            value={editedPlant.water_interval || ""}
            onChange={(e) => handleChange("water_interval", parseInt(e.target.value) || "")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Düngeintervall (Tage)</label>
          <input
            type="number"
            className="form-control"
            value={editedPlant.fertilizer_interval || ""}
            onChange={(e) => handleChange("fertilizer_interval", parseInt(e.target.value) || "")}
          />
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-success" onClick={handleSave}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
