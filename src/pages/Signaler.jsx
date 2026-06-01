import axios from "axios";
import { useState, useEffect } from "react";
import ReportModal from "./ReportModal.jsx";

export default function Signaler() {
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [reported, setReported] = useState({});
  const [error, setError] = useState(null);
  const [msg, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Charger tous les articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get("https://node-projet-deploy.onrender.com/article/all1");
        setArticles(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les articles 😢");
      }
    }
    fetchArticles();
  }, []);

  // ✅ Soumission du signalement
  const handleReportSubmit = async (article, raisons, description) => {
    try {
      const res = await axios.post(
        "https://node-projet-deploy.onrender.com/report",
        { article, raisons, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Réponse du serveur :", res.data);
      setReported((prev) => ({ ...prev, [article]: true }));
      alert("✅ Signalement envoyé, merci !");
      setShowModal(false);
    } catch (err) {
      console.error("Erreur signalement :", err);
      const message =
        err.response?.data?.message || "Erreur lors du signalement";
      setMessage(message);
      alert(message);

      // ✅ Si déjà signalé, on grise le bouton
      if (message.toLowerCase().includes("déjà signalé")) {
        setReported((prev) => ({ ...prev, [article]: true }));
      }
    }
  };

  // ✅ Rendu
  return (
    <div className="container">
      <h1 className="text-center text-decoration-underline text-light m-5">Liste des articles</h1>

      {error && <p style={{ color: "orange" }}>{error}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div key={article._id} className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h3 className="card-title">{article.titre}</h3>
                <p className="card-text">{article.contenu}</p>

                <small className="text-muted d-block mb-2">
                  Publié le{" "}
                  {new Date(article.createdAt).toLocaleDateString("fr-FR")} par{" "}
                  {article.author ? (
                    <span>
                      ✍️ {article.author.nom} {article.author.prenom}
                    </span>
                  ) : (
                    "Auteur inconnu"
                  )}
                </small>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    setSelectedArticle(article._id);
                    setShowModal(true);
                  }}
                  disabled={reported[article._id]}
                >
                  {reported[article._id] ? "✅ Signalé" : "🚩 Signaler"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modale affichée uniquement quand nécessaire */}
      {showModal && (
        <ReportModal
          article={selectedArticle}
          onClose={() => setShowModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}





