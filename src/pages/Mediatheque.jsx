import "../css/accueil.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Mediatheque = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErreur] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchImages = async () => {
      try {
        const res = await axios.get(
          "https://node-projet-deploy-1.onrender.com/image/all",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        setImages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (err.name === "CanceledError") return;

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErreur(err.response?.data?.message || err.message || "Erreur réseau");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    return () => controller.abort();
  }, [navigate, token]);

  if (loading) return <div>Chargement des images...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (images.length === 0) return <div>Aucune image à afficher.</div>;

  return (
        <section className="media-gallery">
    <div className="container mt-4" id="top">
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

      <h2 className="mb-4">📸 Médiathèque</h2>

      <button
        className="btn btn-primary mb-4"
        onClick={() => navigate("/addimage")}
      >
        Ajouter une image
      </button>

      <div className="row">
        {images.map((img, index) => (
          <div
            className="media-item fade-in"
            key={img._id || index}
            style={{ animationDelay: `${index * 800}ms` }}
          >
            <div className="card h-100 shadow-sm">
              <img
                src={img.nom?.replace("http://", "https://")}
                alt={img.alt || "Image médiathèque"}
                className="card-body-top"
                style={{
                  cursor: "pointer",
                  objectFit: "cover",
                  height: 180,
                }}
                onClick={() => setSelectedImage(img)}
              />

              <div className="card-body">
                <h6 className="card-title text-center">
                  {img.alt || "Sans titre"}
                </h6>

                <p
                  className="card-text text-muted"
                  style={{ fontSize: "0.9em" }}
                >
                  Publié le{" "}
                  {img.createdAt
                    ? new Date(img.createdAt).toLocaleDateString("fr-FR")
                    : "date inconnue"}
                  <br />

                  {img.author ? (
                    <span>
                      ✍️ {img.author.nom} {img.author.prenom}
                    </span>
                  ) : (
                    <span>Auteur inconnu</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setSelectedImage(null)}
          style={{
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.nom?.replace("http://", "https://")}
              alt={selectedImage.alt || "Image sélectionnée"}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: 10,
              }}
            />

            <p className="text-center text-white mt-2">
              {selectedImage.alt || "Sans titre"}
            </p>
          </div>
        </div>
      )}
    </div>
  </section>
  );
};

export default Mediatheque;