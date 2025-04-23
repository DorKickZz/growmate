import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function FertilizeModal({ plant, onClose, onFertilized }) {
  const [fertilizerType, setFertilizerType] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("Kein eingeloggter User")
      return
    }

    const { error } = await supabase.from("duengeeintraege").insert([
      {
        pflanze_id: plant.id,
        datum: date,
        menge: amount ? `${fertilizerType} (${amount})` : fertilizerType,
        user_id: user.id,
      },
    ])

    if (!error) {
      // optional: Pflanze aktualisieren (z. B. last_fertilized)
      await supabase
        .from("pflanzen")
        .update({ last_fertilized: date })
        .eq("id", plant.id)

      onFertilized()
      onClose()
    } else {
      console.error("Fehler beim Speichern:", error)
    }
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white rounded-4 shadow p-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🧪 Düngen bestätigen</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <label className="form-label">Art des Düngers</label>
          <input
            className="form-control"
            value={fertilizerType}
            onChange={(e) => setFertilizerType(e.target.value)}
            placeholder="z. B. Flüssigdünger, Düngestäbchen"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Menge (optional)</label>
          <input
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="z. B. 2 ml, 1 Stäbchen"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Datum</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
