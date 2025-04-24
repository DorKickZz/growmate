import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "../utils/cropImage"

export default function ImageCropModal({ image, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropCompleteLocal = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels)
    onCropComplete(croppedImage)
  }

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

        <h5 className="mb-3">🖼️ Bild zuschneiden</h5>
        <div style={{ position: "relative", width: "100%", height: 300 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteLocal}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-success" onClick={handleCropDone}>Zuschneiden</button>
        </div>
      </div>
    </div>
  )
}
