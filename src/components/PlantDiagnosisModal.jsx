import { useEffect, useState } from "react";

export default function PlantDiagnosisModal({ onClose }) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("🌿");

  const emojis = ["🌿", "🌱", "🌵", "🌻", "🍀", "🌳", "🪴"];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setCurrentEmoji(randomEmoji);
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError("Bitte gib eine Problembeschreibung ein.");
      return;
    }

    setLoading(true);
    setDiagnosis("");
    setError("");

    try {
      const prompt = `Hier ist eine Nutzereingabe: "${description}".
Analysiere das Pflanzenproblem und gib konkrete Pflegehinweise.`;

      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Du bist ein Pflanzenexperte. Analysiere Probleme anhand von Nutzereingaben und gib klare, kurze Pflegehinweise.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      const gptData = await gptResponse.json();

      if (gptData.choices && gptData.choices.length > 0) {
        const gptAnswer = gptData.choices[0].message.content;
        setDiagnosis(gptAnswer);
      } else {
        setDiagnosis("Es konnte keine Diagnose erstellt werden. Bitte versuche es erneut.");
      }
    } catch (error) {
      console.error("Fehler bei der Analyse:", error);
      alert("Analyse fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050, overflowY: "auto", padding: "2rem" }}>
      <div className="bg-white rounded-4 shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🔍 Pflanzenanalyse starten</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <label className="form-label">Foto hochladen (optional)</label>
          <input className="form-control" type="file" accept="image/*" onChange={handlePhotoChange} />
          
          {photo && (
            <div className="text-center mt-3">
              <img
                src={URL.createObjectURL(photo)}
                alt="Foto-Vorschau"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <p className="small text-muted mt-2">Foto dient nur zur Ansicht und wird nicht analysiert.</p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Problembeschreibung <span className="text-danger">*</span></label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="z. B. Blätter bekommen braune Spitzen..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {error && <small className="text-danger">{error}</small>}
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-success" onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Analysiere...
              </>
            ) : (
              "Analyse starten"
            )}
          </button>
        </div>

        {loading && (
          <div className="text-center my-4">
            <p className="mt-3 fs-4">{currentEmoji}</p>
            <p className="mt-2">Pflanze wird untersucht…</p>
          </div>
        )}

{diagnosis && (
  <div className="mt-4">
    <h6>Ergebnis:</h6>
    <div className="alert alert-success" style={{ whiteSpace: "pre-wrap" }}>
      {diagnosis}
    </div>
  </div>
)}



      </div>
    </div>
  );
}
