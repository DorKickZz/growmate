import { NavLink } from "react-router-dom"

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <span className="navbar-brand fw-bold text-success">GrowMate</span>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/kalender" className="nav-link">
                Kalender
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/pflanzen" className="nav-link">
                Pflanzenliste
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
