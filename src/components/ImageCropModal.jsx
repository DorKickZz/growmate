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
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
         style={{ background: "rgba(0,0,0,0.75)", zIndex: 2000 }}>
      <div className="bg-white p-4 rounded shadow" style={{ width: "90%", maxWidth: "600px" }}>
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
