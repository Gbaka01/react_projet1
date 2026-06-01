import { useState } from "react"
import axios from "axios"

export default function ReNewPassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    if (!token) {
      setError("⚠️ Vous devez être connecté")
      return
    }

    try {
      const res = await axios.put(
        "https://node-projet-deploy.onrender.com/user/renew-password", // ✅ sans guillemets autour
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message || "✅ Mot de passe mis à jour")
      setError(null)
      setForm({ oldPassword: "", newPassword: "" })
    } catch (err) {
      console.error("Erreur API:", err.response || err)
      setError(err.response?.data?.message || "❌ Erreur lors de la mise à jour")
    }
  }

  return (
    <section>
      <h2>Changer mon mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ancien mot de passe</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Mettre à jour
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  )
}



