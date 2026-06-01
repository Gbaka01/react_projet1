import axios from "axios"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Login() {
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [message, setMessage] = useState(null)
  const [flash] = useState(location.state?.flash || null)
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    try {
      const res = await axios.post(
        "https://node-projet-deploy.onrender.com/user/login", // ✅ via .env
        formData
      )

      console.log(res.data)

      // ✅ stocker token
      localStorage.setItem("token", res.data.token)

      // ✅ stocker nom uniquement s’il existe
      if (res.data.user?.nom) {
        localStorage.setItem("nom", res.data.user.nom)
      }

      navigate("/")
    } catch (err) {
      console.error(err.response?.data)
      setMessage(err.response?.data?.message || "Erreur de connexion")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          name="email"
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          onChange={handleChange}
          required
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="form-control"
          id="password"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Envoyer
      </button>

      {flash && <p className="text-success">{flash}</p>}
      {message && <p className="text-danger">{message}</p>}
    </form>
  )
}

