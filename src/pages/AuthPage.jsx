// src/pages/AuthPage.jsx
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegister(true)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const { error } = isRegister
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">{isRegister ? "Registrieren" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
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
        <div className="mb-3">
          <label className="form-label">Passwort</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success w-100">
          {isRegister ? "Registrieren" : "Login"}
        </button>

        <div className="text-center mt-3">
          {isRegister ? (
            <span>
              Bereits registriert?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setIsRegister(false)}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              Noch kein Account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setIsRegister(true)}
              >
                Registrieren
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
