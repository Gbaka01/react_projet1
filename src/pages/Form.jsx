import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const [alt, setAlt] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔑 Récupération du token depuis localStorage
  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) return setError("Veuillez sélectionner un fichier");

    const formData = new FormData();
    formData.append("alt", alt);
    formData.append("nom", file);

    try {
      const response = await axios.post(
        "https://node-projet-deploy.onrender.com/image/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 🔑 ajout du token
          },
        }
      );

      console.log(response.data);
      navigate("/mediatheque");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur serveur");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="alt">Descriptif</label>
        <input
          type="text"
          name="alt"
          id="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />

        <label htmlFor="nom">Fichier</label>
        <input
          type="file"
          name="nom"
          id="nom"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Enregistrer</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}











