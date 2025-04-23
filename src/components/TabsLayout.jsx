import { useState } from "react"
import Dashboard from "../pages/Dashboard"
import PlantList from "../pages/PlantList"
import CalendarView from "./CalendarView"

export default function TabsLayout() {
  const [active, setActive] = useState("dashboard")

  return (
    <div className="container mt-4">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${active === 'dashboard' ? 'active' : ''}`} onClick={() => setActive("dashboard")}>
            Übersicht
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${active === 'calendar' ? 'active' : ''}`} onClick={() => setActive("calendar")}>
            Kalender
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${active === 'list' ? 'active' : ''}`} onClick={() => setActive("list")}>
            Pflanzenliste
          </button>
        </li>
      </ul>

      {active === "dashboard" && <Dashboard />}
      {active === "calendar" && <CalendarView />}
      {active === "list" && <PlantList />}
    </div>
  )
}
