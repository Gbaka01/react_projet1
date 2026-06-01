import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
const CreateArticle = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
  });

  const [message, setMessage] = useState(null);

  // Gérer la saisie du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Récupérer le token (stocké après login)
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://node-projet-deploy.onrender.com/article/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔑 token ajouté ici
          },
        }
      );

      setMessage("✅ Article créé avec succès !");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "❌ Erreur lors de l'envoi");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Créer un article</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titre" className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contenu" className="form-label">Contenu</label>
          <textarea
            className="form-control"
            id="contenu"
            name="contenu"
            rows="3"
            value={formData.contenu}
            onChange={handleChange}
          ></textarea>
        </div>
                            
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
     
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default CreateArticle;


