import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { createThumbnail } from "../utils/imageUtils";
import EXIF from "exif-js"; // Für Exif Korrektur

// Hilfsfunktion zur Bildorientierung
const fixImageOrientation = (image) => {
  return new Promise((resolve) => {
    EXIF.getData(image, function () {
      const orientation = EXIF.getTag(this, "Orientation");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      switch (orientation) {
        case 6: // 90° im Uhrzeigersinn
          canvas.width = image.height;
          canvas.height = image.width;
          ctx.rotate(90 * Math.PI / 180);
          ctx.drawImage(image, 0, -image.height);
          break;
        case 3: // 180°
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.rotate(Math.PI);
          ctx.drawImage(image, -image.width, -image.height);
          break;
        case 8: // 270°
          canvas.width = image.height;
          canvas.height = image.width;
          ctx.rotate(-90 * Math.PI / 180);
          ctx.drawImage(image, -image.width, 0);
          break;
        default:
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
      }

      resolve(canvas.toDataURL("image/jpeg"));
    });
  });
};

export default function PlantEditModal({ plant, onClose, onSave }) {
  const [editedPlant, setEditedPlant] = useState({ ...plant });
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    setEditedPlant({ ...plant });
  }, [plant]);

  const handleChange = (field, value) => {
    setEditedPlant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    let photoUrl = editedPlant.photo_url;
    let thumbnailUrl = editedPlant.thumbnail_url;

    if (newPhoto) {
      const timestamp = Date.now();
      const originalPath = `originals/${plant.id}_${timestamp}.jpg`;
      const thumbnailPath = `thumbnails/${plant.id}_${timestamp}_thumb.jpg`;

      // Bild orientieren
      const imageUrl = URL.createObjectURL(newPhoto);
      const img = new Image();
      img.src = imageUrl;

      await new Promise((resolve) => {
        img.onload = async () => {
          const correctedImageUrl = await fixImageOrientation(img);
          const correctedImageBlob = await fetch(correctedImageUrl).then((res) => res.blob());

          // Original hochladen
          const { error: originalError } = await supabase.storage
            .from("pflanzenfotos")
            .upload(originalPath, correctedImageBlob, { upsert: true });

          if (originalError) {
            console.error("Upload Fehler Original:", originalError);
          } else {
            const { publicUrl: originalPublicUrl } = supabase.storage
              .from("pflanzenfotos")
              .getPublicUrl(originalPath).data;
            photoUrl = originalPublicUrl;
          }

          // Thumbnail erstellen und hochladen
          const thumbnailBlob = await createThumbnail(newPhoto);

          const { error: thumbError } = await supabase.storage
            .from("pflanzenfotos")
            .upload(thumbnailPath, thumbnailBlob, { upsert: true });

          if (thumbError) {
            console.error("Upload Fehler Thumbnail:", thumbError);
          } else {
            const { publicUrl: thumbPublicUrl } = supabase.storage
              .from("pflanzenfotos")
              .getPublicUrl(thumbnailPath).data;
            thumbnailUrl = thumbPublicUrl;
          }

          resolve();
        };
      });
    }

    await onSave(
      {
        ...editedPlant,
        photo_url: photoUrl,
        thumbnail_url: thumbnailUrl,
      },
      true
    );
  };

  if (!plant) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050, overflowY: "auto", padding: "2rem" }}>
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
          <label className="form-label">Neues Foto (optional)</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
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
