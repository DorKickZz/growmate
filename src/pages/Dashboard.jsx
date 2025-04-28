import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { format } from "date-fns"
import { BsDropletFill, BsFlower2 } from "react-icons/bs"
import { FaFlask, FaRecycle } from "react-icons/fa"
import PlantDiagnosisModal from "../components/PlantDiagnosisModal"; // Import hinzufügen




export default function Dashboard() {
  const [plants, setPlants] = useState([])
  const [latestPlant, setLatestPlant] = useState(null)
  const [plantsToWater, setPlantsToWater] = useState([])
  const [plantsToFertilize, setPlantsToFertilize] = useState([])
  const [plantsToRepot, setPlantsToRepot] = useState([])

  const [showWater, setShowWater] = useState(false)
  const [showFertilize, setShowFertilize] = useState(false)
  const [showRepot, setShowRepot] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false); // State anlegen

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

      setPlantsToRepot(
        data.filter((plant) => plant.repotting_needed === true)
      )
    }
  }

  const InfoCard = ({ title, value, icon, color, onClick }) => (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        className={`border-start border-${color} border-5 bg-white p-3 p-md-4 rounded shadow-sm mb-3`}
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted fw-normal mb-1">{title}</h6>
            <h5 className="fw-semibold m-0">{value}</h5>
          </div>
          <div className={`fs-3 text-${color}`}>{icon}</div>
        </div>
      </div>
    </div>
  )

  const handleMarkRepotted = async (plantId) => {
    const { error } = await supabase
      .from("pflanzen")
      .update({ repotting_needed: false })
      .eq("id", plantId);
  
    if (!error) {
      fetchPlants(); // neu laden!
    }
  };
  

  const PlantList = ({ title, plants, getDescription }) => (
    <div className="mb-4">
      <h5 className="fw-semibold mb-2">{title}</h5>
      <ul className="list-group">
  {plants.map((p) => (
    <li
      key={p.id}
      className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
    >
      <div className="fw-medium">{p.name}</div>
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
        <small className="text-muted">{getDescription(p)}</small>
        {/* Nur wenn es um Umtopfen geht */}
        {title.includes("Umtopfen") && (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => handleMarkRepotted(p.id)}
          >
            ✅ Umgetopft
          </button>
        )}
      </div>
    </li>
  ))}
</ul>

    </div>
  )

  return (
    <div className="container py-4 px-3">
      <h2 className="mb-4 fw-bold text-center text-md-start">
        <i className="bi bi-bar-chart-line-fill me-2" /> Überblick
      </h2>

      <div className="row g-3 mb-4">
        <InfoCard
          title="Gesamtzahl"
          value={plants.length}
          icon={<BsFlower2 />}
          color="success"
          onClick={() => setShowAll(!showAll)}
        />
        <InfoCard
          title="Gießen nötig"
          value={plantsToWater.length}
          icon={<BsDropletFill />}
          color="info"
          onClick={() => setShowWater(!showWater)}
        />
        <InfoCard
          title="Düngen nötig"
          value={plantsToFertilize.length}
          icon={<FaFlask />}
          color="warning"
          onClick={() => setShowFertilize(!showFertilize)}
        />
        <InfoCard
          title="Umtopfen nötig"
          value={plantsToRepot.length}
          icon={<FaRecycle />}
          color="danger"
          onClick={() => setShowRepot(!showRepot)}
        />
      </div>

      <div className="text-center mb-4">
  <button
    className="btn btn-outline-primary"
    onClick={() => setShowDiagnosisModal(true)}
  >
    🔍 Pflanzenproblem erkennen lassen
  </button>
</div>

{showDiagnosisModal && <PlantDiagnosisModal onClose={() => setShowDiagnosisModal(false)} />}


      {showAll && (
        <PlantList
          title="🌱 Alle Pflanzen"
          plants={plants}
          getDescription={(p) => `${p.category || "–"} | ${p.location || "–"}`}
        />
      )}

      {showWater && (
        <PlantList
          title="💧 Gießen fällig"
          plants={plantsToWater}
          getDescription={(p) => `Zuletzt gegossen: ${format(new Date(p.last_watered), "dd.MM.yyyy")}`}
        />
      )}

      {showFertilize && (
        <PlantList
          title="🧪 Düngung fällig"
          plants={plantsToFertilize}
          getDescription={(p) => `Zuletzt gedüngt: ${format(new Date(p.last_fertilized), "dd.MM.yyyy")}`}
        />
      )}

      {showRepot && (
        <PlantList
          title="🔁 Umtopfen nötig"
          plants={plantsToRepot}
          getDescription={(p) => `${p.category || "–"} | ${p.location || "–"}`}
        />
      )}

      {latestPlant && (
        <div className="bg-white rounded shadow-sm p-4 border-start border-primary border-5 mt-4">
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
