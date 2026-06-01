
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Accueil() {
  const navigate = useNavigate()
  const [nom, setNom] = useState(localStorage.getItem("nom"))
  const [token, setToken] = useState(localStorage.getItem("token"))

  // 🔄 Mettre à jour quand le localStorage change
  useEffect(() => {
    const handleStorageChange = () => {
      setNom(localStorage.getItem("nom"))
      setToken(localStorage.getItem("token"))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  function handleClick() {
    localStorage.removeItem("token")
    localStorage.removeItem("nom")
    setNom(null)
    setToken(null)
    navigate("/login") // ✅ redirection vers login
  }

  return (
    <>
       
      <h1>Accueil</h1>
      <h2>Bienvenue sur le réseau social GOLI Gore Gbaka</h2>

      {token && nom ? (
        <>
          <p>
            Bonjour, <strong>{nom}</strong> 👋 vous êtes connecté sur le réseau social
            GOLI Goré Gbaka
          </p>
          <button className="btn btn-danger me-2"  onClick={() =>navigate('/renew-password')}>Changer le mot de passe

          </button>
          <button className="btn btn-primary" onClick={handleClick}>
            Se déconnecter
          </button>
        </>
      ) : (
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Se connecter
        </button>
      )}
    </>
  )
}
