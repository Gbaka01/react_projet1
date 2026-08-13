import "../css/accueil.css";
import { useEffect, useState } from "react";
import axios from "axios";

const SERVER_URL = (
  import.meta.env.VITE_SERVER_URL ||
  "https://node-projet-deploy-1.onrender.com"
).replace(/\/+$/, "");

export default function ListArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      const endpoint = `${SERVER_URL}/article/all`;

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(endpoint, {
          signal: controller.signal,
        });

        // Compatible avec :
        // [article1, article2]
        // ou { articles: [article1, article2] }
        const data = response.data?.articles ?? response.data;

        if (!Array.isArray(data)) {
          throw new Error(
            "Le serveur n'a pas renvoyé une liste d'articles."
          );
        }

        setArticles(data);
      } catch (err) {
        const requestCancelled =
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED";

        if (requestCancelled) return;

        console.error("Erreur de chargement :", {
          endpoint,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        if (err.response?.status === 404) {
          setError(
            `Route API introuvable : ${endpoint}`
          );
        } else if (!err.response) {
          setError(
            "Le serveur est inaccessible ou bloque la requête CORS."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Impossible de charger les articles."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchArticles();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <p className="text-center">⏳ Chargement...</p>;
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <div className="container" id="top">
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
        <p className="text-center">Aucun article trouvé.</p>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div
              key={article._id}
              className="col-md-4 mb-3"
            >
              <article className="card h-100 p-3 shadow-sm">
                <h2 className="card-title h3">
                  {article.titre}
                </h2>

                <p className="card-text">
                  {article.contenu}
                </p>

                <small className="text-muted mt-auto">
                  Publié le{" "}
                  {article.createdAt
                    ? new Date(
                        article.createdAt
                      ).toLocaleDateString("fr-FR")
                    : "—"}
                  {" • "}
                  {article.author
                    ? `✍️ ${article.author.nom ?? ""} ${
                        article.author.prenom ?? ""
                      }`
                    : "Auteur inconnu"}
                </small>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}