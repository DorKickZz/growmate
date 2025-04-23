import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import "./AuthPage.css"


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!email || !password) {
      setMessage("Bitte fülle alle Felder aus.")
      return
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return setMessage("Login fehlgeschlagen: " + error.message)

      setMessage("Eingeloggt ✅")
      setTimeout(() => navigate("/"), 500)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return setMessage("Registrierung fehlgeschlagen: " + error.message)

      setMessage("Registrierung erfolgreich. Bitte bestätige deine E-Mail ✅")
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <div className="text-center mb-4">
        <h1 className="fw-bold">🌿 GrowMate</h1>
        <p className="text-muted small">
          {isLogin ? "Melde dich an, um deine Pflanzen zu pflegen." : "Erstelle einen Account und starte durch!"}
        </p>
      </div>

      <div className="mb-3 d-flex justify-content-center">
        <button
          className={`btn ${isLogin ? "btn-success" : "btn-outline-success"} me-2`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn ${!isLogin ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setIsLogin(false)}
        >
          Registrieren
        </button>
      </div>

      {message && <div className="alert alert-info text-center">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">E-Mail</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Passwort</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success w-100">
          {isLogin ? "Einloggen" : "Registrieren"}
        </button>
      </form>
    </div>
  )
}
