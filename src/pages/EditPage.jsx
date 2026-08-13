import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await axios.get(
          `https://node-projet-deploy-1.onrender.com/article/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTitre(res.data.titre);
        setContenu(res.data.contenu);
      } catch (err) {
        console.error(err);
        setError("Article introuvable");
      }
    }

    fetchArticle();
  }, [id, token]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.put(
        `https://node-projet-deploy-1.onrender.com/article/${id}`,
        { titre, contenu },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/myarticles");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur serveur");
    }
  }

  return (
    <div className="container mt-5">
      <h2>Modifier l’article</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Titre</label>
          <input
            className="form-control"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Contenu</label>
          <textarea
            className="form-control"
            rows="5"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
        </div>

        <button className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
}
