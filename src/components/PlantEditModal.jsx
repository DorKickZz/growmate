import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function PlantEditModal({ plant, onClose, onSave }) {
  const [editedPlant, setEditedPlant] = useState({ ...plant })
  const [photoFile, setPhotoFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setEditedPlant({ ...plant })
  }, [plant])

  const handleChange = (field, value) => {
    setEditedPlant((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    let photo_url = editedPlant.photo_url

    if (photoFile) {
      setUploading(true)
      const fileExt = photoFile.name.split(".").pop()
      const filePath = `photos/${plant.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("pflanzenfotos")
        .upload(filePath, photoFile, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from("pflanzenfotos").getPublicUrl(filePath)
        photo_url = data.publicUrl
      } else {
        console.error("Fehler beim Hochladen:", uploadError)
        setUploading(false)
        return
      }

      setUploading(false)
    }

    onSave({ ...editedPlant, photo_url }, true)
  }

  if (!plant) return null

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
        overflowY: "auto",
        padding: "2rem",
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

        <div className="mb-3">
          <label className="form-label">Neues Foto hochladen</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
          {editedPlant.photo_url && (
            <img
              src={editedPlant.photo_url}
              alt="Vorschau"
              className="img-thumbnail mt-2"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          )}
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-success" onClick={handleSave} disabled={uploading}>
            {uploading ? "Lade hoch..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  )
}
