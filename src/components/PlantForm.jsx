import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function PlantForm() {
  const [plant, setPlant] = useState({
    name: "",
    photo_url: "",
    location: "",
    category: "",
    light: "",
    temperature: "",
    water_interval: 7,
    fertilizer_interval: 30,
    last_watered: "",
    last_fertilized: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPlant((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from("pflanzen").insert([plant])

    if (error) {
      alert("Fehler beim Speichern: " + error.message)
    } else {
      alert("Pflanze gespeichert! 🌱")
      setPlant({
        name: "",
        photo_url: "",
        location: "",
        category: "",
        light: "",
        temperature: "",
        water_interval: 7,
        fertilizer_interval: 30,
        last_watered: "",
        last_fertilized: "",
        notes: "",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container bg-white p-4 mt-5 rounded shadow-sm">
      <h2 className="mb-4">🌿 Neue Pflanze erfassen</h2>

      <div className="mb-3">
        <label className="form-label">Pflanzenname</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={plant.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Foto-URL</label>
        <input
          type="url"
          name="photo_url"
          className="form-control"
          value={plant.photo_url}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Standort</label>
        <input
          type="text"
          name="location"
          className="form-control"
          value={plant.location}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Kategorie</label>
        <select
          name="category"
          className="form-select"
          value={plant.category}
          onChange={handleChange}
          required
        >
          <option value="">– wählen –</option>
          <option value="Zimmerpflanze">Zimmerpflanze</option>
          <option value="Kräuter">Kräuter</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Sukkulente">Sukkulente</option>
          <option value="Blühpflanze">Blühpflanze</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Licht</label>
          <input
            type="text"
            name="light"
            className="form-control"
            value={plant.light}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Temperatur</label>
          <input
            type="text"
            name="temperature"
            className="form-control"
            value={plant.temperature}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Gießintervall (Tage)</label>
          <input
            type="number"
            name="water_interval"
            className="form-control"
            value={plant.water_interval}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Düngeintervall (Tage)</label>
          <input
            type="number"
            name="fertilizer_interval"
            className="form-control"
            value={plant.fertilizer_interval}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Letztes Gießen</label>
          <input
            type="date"
            name="last_watered"
            className="form-control"
            value={plant.last_watered}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Letztes Düngen</label>
          <input
            type="date"
            name="last_fertilized"
            className="form-control"
            value={plant.last_fertilized}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3 mt-3">
        <label className="form-label">Notizen</label>
        <textarea
          name="notes"
          className="form-control"
          rows="3"
          value={plant.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-success">Speichern</button>
    </form>
  )
}
