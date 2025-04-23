import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { format } from "date-fns"
import { BsDropletFill, BsFlower2 } from "react-icons/bs"
import { FaFlask } from "react-icons/fa"

export default function Dashboard() {
  const [plants, setPlants] = useState([])
  const [latestPlant, setLatestPlant] = useState(null)
  const [plantsToWater, setPlantsToWater] = useState([])
  const [plantsToFertilize, setPlantsToFertilize] = useState([])
  const [showWaterList, setShowWaterList] = useState(false)
  const [showFertilizeList, setShowFertilizeList] = useState(false)
  const [showAllPlants, setShowAllPlants] = useState(false)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    const { data, error } = await supabase
      .from("pflanzen")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setPlants(data)
      setLatestPlant(data[0] || null)
      const today = new Date()

      setPlantsToWater(
        data.filter((plant) => {
          if (!plant.last_watered || !plant.water_interval) return false
          const last = new Date(plant.last_watered)
          const next = new Date(last)
          next.setDate(last.getDate() + plant.water_interval)
          return next <= today
        })
      )

      setPlantsToFertilize(
        data.filter((plant) => {
          if (!plant.last_fertilized || !plant.fertilizer_interval) return false
          const last = new Date(plant.last_fertilized)
          const next = new Date(last)
          next.setDate(last.getDate() + plant.fertilizer_interval)
          return next <= today
        })
      )
    }
  }

  const InfoCard = ({ title, value, icon, color, toggle }) => (
    <div className="col-md-4">
      <div
        className={`border-start border-${color} border-5 bg-white p-4 rounded shadow-sm`}
        style={{ cursor: toggle ? "pointer" : "default" }}
        onClick={toggle}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted fw-normal">{title}</h6>
            <h4 className="fw-semibold">{value}</h4>
          </div>
          <div className={`fs-3 text-${color}`}>{icon}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">
        <i className="bi bi-bar-chart-line-fill me-2" /> Überblick
      </h2>

      <div className="row g-4 mb-4">
        <InfoCard
          title="Gesamtzahl"
          value={plants.length}
          icon={<BsFlower2 />}
          color="success"
          toggle={() => setShowAllPlants(!showAllPlants)}
        />
        <InfoCard
          title="Gießen nötig"
          value={plantsToWater.length}
          icon={<BsDropletFill />}
          color="info"
          toggle={() => setShowWaterList(!showWaterList)}
        />
        <InfoCard
          title="Düngen nötig"
          value={plantsToFertilize.length}
          icon={<FaFlask />}
          color="warning"
          toggle={() => setShowFertilizeList(!showFertilizeList)}
        />
      </div>

      {showAllPlants && (
        <div className="mb-4">
          <h5 className="fw-semibold mb-2">🌿 Alle Pflanzen</h5>
          <ul className="list-group">
            {plants.map((plant) => (
              <li className="list-group-item d-flex justify-content-between" key={plant.id}>
                <span>{plant.name}</span>
                <small className="text-muted">
                  {plant.category || "–"} | {plant.location || "–"}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showWaterList && (
        <div className="mb-4">
          <h5 className="fw-semibold mb-2">💧 Überfällige Pflanzen (Gießen)</h5>
          <ul className="list-group">
            {plantsToWater.map((plant) => (
              <li className="list-group-item d-flex justify-content-between" key={plant.id}>
                {plant.name}
                <small className="text-muted">
                  Letztes Gießen: {format(new Date(plant.last_watered), "dd.MM.yyyy")}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showFertilizeList && (
        <div className="mb-4">
          <h5 className="fw-semibold mb-2">🧪 Überfällige Pflanzen (Düngen)</h5>
          <ul className="list-group">
            {plantsToFertilize.map((plant) => (
              <li className="list-group-item d-flex justify-content-between" key={plant.id}>
                {plant.name}
                <small className="text-muted">
                  Letztes Düngen: {format(new Date(plant.last_fertilized), "dd.MM.yyyy")}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {latestPlant && (
        <div className="bg-white rounded shadow-sm p-4 border-start border-primary border-5">
          <h5 className="mb-2">
            <span className="me-2 text-primary">🌱</span>
            Zuletzt hinzugefügt
          </h5>
          <h6 className="fw-semibold mb-1">{latestPlant.name}</h6>
          <small className="text-muted">
            Kategorie: {latestPlant.category || "–"} | Standort: {latestPlant.location || "–"}<br />
            Hinzugefügt: {format(new Date(latestPlant.created_at), "dd.MM.yyyy")}
          </small>
        </div>
      )}
    </div>
  )
}
