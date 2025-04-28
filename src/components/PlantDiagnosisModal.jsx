import { useState } from "react";

export default function PlantDiagnosisModal({ onClose }) {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingGPT, setLoadingGPT] = useState(false);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const uploadPhotoToHuggingFace = async (photo) => {
    setLoadingPhoto(true);
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: photo,
      });

      const data = await response.json();
      console.log("Antwort von Hugging Face:", data);
      return data;
    } catch (error) {
      console.error("Fehler beim Hochladen an Hugging Face:", error);
      throw error;
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleAnalyze = async () => {
    if (!description && !photo) {
      alert("Bitte lade ein Foto hoch oder gib eine Beschreibung ein.");
      return;
    }

    setDiagnosis("");

    try {
      let imageDescription = "";

      if (photo) {
        const data = await uploadPhotoToHuggingFace(photo);

        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
          imageDescription = data[0].generated_text;
          console.log("Bildbeschreibung von Hugging Face:", imageDescription);
        } else {
          console.warn("Keine Bildbeschreibung erhalten oder Modell schläft.");
        }
      }

      // GPT-Prompt vorbereiten
      let prompt = "";

      if (imageDescription && description) {
        prompt = `Hier ist eine automatische Bildbeschreibung: "${imageDescription}". 
Zusätzlich gibt der Nutzer folgende Beschreibung an: "${description}".
Analysiere basierend auf beiden Informationen das Pflanzenproblem und gib konkrete Pflegehinweise.`;
      } else if (imageDescription) {
        prompt = `Hier ist eine automatische Bildbeschreibung: "${imageDescription}".
Analysiere basierend darauf das Pflanzenproblem und gib konkrete Pflegehinweise.`;
      } else {
        prompt = `Hier ist eine Nutzereingabe: "${description}".
Analysiere das Pflanzenproblem und gib konkrete Pflegehinweise.`;
      }

      console.log("Finaler GPT-Prompt:", prompt);

      // GPT-Analyse starten
      setLoadingGPT(true);
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
              content: "Du bist ein Pflanzenexperte. Analysiere Probleme anhand von Bildbeschreibungen und Nutzereingaben und gib klare, kurze Pflegehinweise.",
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
      setLoadingGPT(false);
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

          {/* Foto-Vorschau */}
          {photo && (
            <div className="mb-3 text-center">
              <img
                src={URL.createObjectURL(photo)}
                alt="Foto-Vorschau"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Problembeschreibung</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="z. B. Blätter bekommen braune Spitzen..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-success" onClick={handleAnalyze} disabled={loadingPhoto || loadingGPT}>
            {loadingPhoto || loadingGPT ? "Bitte warten..." : "Analyse starten"}
          </button>
        </div>

        {/* Ladeanzeige */}
        {(loadingPhoto || loadingGPT) && (
          <div className="text-center my-4">
            {loadingPhoto && (
              <>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">📷 Foto wird analysiert…</p>
              </>
            )}
            {loadingGPT && !loadingPhoto && (
              <>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2">💬 GPT denkt nach…</p>
              </>
            )}
          </div>
        )}

        {/* Ergebnisanzeige */}
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
