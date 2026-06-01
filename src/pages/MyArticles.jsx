import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔒 Si pas de token → login
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 📌 Charger mes articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get(
          "https://node-projet-deploy.onrender.com/article/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setArticles(response.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les articles 😢");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [token]);

  // 🗑️ SUPPRESSION d'un article
  async function handleDelete(id) {
    try {
      await axios.delete(
        `https://node-projet-deploy.onrender.com/article/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mise à jour du state
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || err.message);
      }
    }
  }

  // ✏️ MISE À JOUR → redirection vers la page d'édition
  function handleUpdate(id) {
    navigate(`/article/edit/${id}`);
  }

  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h1 className="text-center text-decoration-underline text-light m-5">
        Liste de mes articles
      </h1>

      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div key={article._id} className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h3 className="card-title">{article.titre}</h3>
                <p className="card-text">{article.contenu}</p>

                <div className="d-flex gap-2 mb-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(article._id)}
                  >
                    Supprimer
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(article._id)}
                  >
                    Modifier
                  </button>
                </div>

                <small className="text-muted">
                  Publié le {new Date(article.createdAt).toLocaleDateString()} par{" "}
                  {article.author ? (
                    <>
                      ✍️ {article.author.nom} {article.author.prenom || ""}
                    </>
                  ) : (
                    "Auteur inconnu"
                  )}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticles;


