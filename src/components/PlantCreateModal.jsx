import { useState } from "react"
import { supabase } from "../supabaseClient"
import ImageCropModal from "./ImageCropModal"

export default function PlantCreateModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    last_watered: "",
    water_interval: "",
    last_fertilized: "",
    fertilizer_interval: "",
    last_repotted: "",
  })

  const [imageFile, setImageFile] = useState(null)
  const [cropImageSrc, setCropImageSrc] = useState(null)
  const [showCropper, setShowCropper] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (file, plantId) => {
    const fileExt = file.name.split(".").pop()
    const filePath = `${plantId}.${fileExt}`

    const { error } = await supabase.storage
      .from("pflanzenfotos")
      .upload(filePath, file, { upsert: true })

    if (error) {
      console.error("Upload error:", error)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from("pflanzenfotos")
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  }

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("No user session found")
      return
    }

    try {
      const insertData = {
        name: formData.name || null,
        category: formData.category || null,
        location: formData.location || null,
        last_watered: formData.last_watered || null,
        water_interval: formData.water_interval ? parseInt(formData.water_interval) : null,
        last_fertilized: formData.last_fertilized || null,
        fertilizer_interval: formData.fertilizer_interval ? parseInt(formData.fertilizer_interval) : null,
        last_repotted: formData.last_repotted || null,
        user_id: user.id,
      }

      const { data, error: insertError } = await supabase
        .from("pflanzen")
        .insert([insertData])
        .select()
        .single()

      if (insertError) {
        console.error("Insert error:", JSON.stringify(insertError, null, 2))

        return
      }

      let photoUrl = null
      if (imageFile) {
        photoUrl = await handleImageUpload(imageFile, data.id)
        if (photoUrl) {
          await supabase.from("pflanzen").update({ photo_url: photoUrl }).eq("id", data.id)
        }
      }

      onCreated()
      onClose()
    } catch (err) {
      console.error("Fehler beim Speichern:", err)
    }
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div className="bg-white rounded-4 shadow p-4" style={{ width: "100%", maxWidth: "700px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🌱 Neue Pflanze anlegen</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Kategorie</label>
            <input className="form-control" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Standort</label>
            <input className="form-control" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Letztes Gießen</label>
            <input type="date" className="form-control" name="last_watered" value={formData.last_watered} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gießintervall (Tage)</label>
            <input type="number" className="form-control" name="water_interval" value={formData.water_interval} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Letztes Düngen</label>
            <input type="date" className="form-control" name="last_fertilized" value={formData.last_fertilized} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Düngeintervall (Tage)</label>
            <input type="number" className="form-control" name="fertilizer_interval" value={formData.fertilizer_interval} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Letztes Umtopfen</label>
            <input type="date" className="form-control" name="last_repotted" value={formData.last_repotted} onChange={handleChange} />
          </div>

          <div className="col-md-12">
            <label className="form-label">Foto</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                  setCropImageSrc(reader.result)
                  setShowCropper(true)
                }
                if (file) reader.readAsDataURL(file)
              }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-secondary me-2" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-success" onClick={handleSubmit}>Speichern</button>
        </div>
      </div>

      {showCropper && cropImageSrc && (
        <ImageCropModal
          image={cropImageSrc}
          onClose={() => setShowCropper(false)}
          onCropComplete={(croppedFile) => {
            setImageFile(croppedFile)
            setShowCropper(false)
          }}
        />
      )}
    </div>
  )
}
