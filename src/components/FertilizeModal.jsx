import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function FertilizeModal({ plant, onClose, onFertilized }) {
  const [fertilizerType, setFertilizerType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [fertilizers, setFertilizers] = useState([]);

  useEffect(() => {
    const fetchFertilizers = async () => {
      const { data, error } = await supabase
        .from("duengemittel")
        .select("*")
        .order("name", { ascending: true });

      if (!error) {
        setFertilizers(data);
      }
    };

    fetchFertilizers();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from("duengeeintraege")
      .insert([
        {
          pflanze_id: plant.id,
          datum: date,
          menge: fertilizerType + (amount ? ` (${amount})` : ""),
          user_id: plant.user_id,
        },
      ]);

    if (!error) {
      await supabase
        .from("pflanzen")
        .update({ last_fertilized: date })
        .eq("id", plant.id);

      onFertilized();
      onClose();
    } else {
      console.error("Fehler beim Speichern:", error);
    }
  };

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
          <label className="form-label">Düngemittel wählen</label>
          <select
            className="form-select"
            value={fertilizerType}
            onChange={(e) => setFertilizerType(e.target.value)}
          >
            <option value="">-- Eigenen Namen eingeben --</option>
            {fertilizers.map((fertilizer) => (
              <option key={fertilizer.id} value={fertilizer.name}>
                {fertilizer.name} ({fertilizer.interval} Tage)
              </option>
            ))}
          </select>
        </div>

        {!fertilizerType && (
          <div className="mb-3">
            <label className="form-label">Name des Düngers</label>
            <input
              className="form-control"
              placeholder="z.B. Volldünger, Spezialdünger"
              value={fertilizerType}
              onChange={(e) => setFertilizerType(e.target.value)}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Menge (optional)</label>
          <input
            className="form-control"
            placeholder="z.B. 5ml, 1 Stäbchen"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
  );
}
