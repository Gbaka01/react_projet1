import "../css/accueil.css";
import { useEffect, useState } from "react";
import axios from "axios";

const ListArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ bouton visible après scroll
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ fonction manquante
  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ écoute du scroll
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get(
          "https://node-projet-deploy.onrender.com/article/all"
        );
        setArticles(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Impossible de charger les articles 😢");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container" id="top">
      {/* ✅ afficher seulement si on a scroll */}
      {showScrollTop && (
        <button
          type="button"
          className="scrollTop"
          onClick={handleScrollTop}
          aria-label="Retour en haut"
          title="Retour en haut"
        >
          ↑
        </button>
      )}

      <h1 className="text-center text-decoration-underline text-light m-5">
        Liste des articles
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

                <small className="text-muted">
                  Publié le{" "}
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString("fr-FR")
                    : "—"}{" "}
                  •{" "}
                  {article.author ? (
                    <>✍️ {article.author.nom} {article.author.prenom}</>
                  ) : (
                    <>Auteur inconnu</>
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

export default ListArticles;