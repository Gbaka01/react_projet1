import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Mesimages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErreur] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔒 Redirection si pas connecté
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 🗑️ Suppression d'une image
  async function handleDelete(id) {
    try {
      await axios.delete(
        `https://node-projet-deploy-1.onrender.com/image/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setErreur(err.response?.data?.message || err.message);
      }
    }
  }

  // 📥 Récupération des images
  useEffect(() => {
    const controller = new AbortController();

    async function fetchImages() {
      try {
        const res = await axios.get(
          "https://node-projet-deploy-1.onrender.com/image/mesimages",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal, // ✅ annule proprement
          }
        );
        setImages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (axios.isCancel(err)) return; // ✅ requête annulée proprement
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErreur(err.response?.data?.message || err.message || "Erreur réseau");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
    return () => controller.abort(); // ✅ annule la requête si le composant se démonte
  }, [navigate, token]);

  if (loading) return <div>Chargement des images...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (images.length === 0) return <div>Aucune image à afficher.</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🖼️ Mes Images</h2>

      {/* ✅ Le bouton “Ajouter” placé une seule fois */}
      <div className="mb-3 text-end">
        <button className="btn btn-primary" onClick={() => navigate("/addimage")}>
          Ajouter une image
        </button>
      </div>

      <div className="row">
        {images.map((img) => (
          <div className="col-md-3 mb-4" key={img._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={
                  img.nom?.startsWith("http")
                    ? img.nom
                    : `https://node-projet-deploy-1.onrender.com/uploads/${img.nom}`
                }
                alt={img.alt || ""}
                className="card-img-top"
                style={{ cursor: "pointer", objectFit: "cover", height: 180 }}
                onClick={() => setSelectedImage(img)}
              />

              <div className="card-body">
                <h6 className="card-title text-center">{img.alt || "Sans titre"}</h6>
              </div>

              <div className="card-footer text-center">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(img._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🖼️ Modal d'agrandissement */}
      {selectedImage && (
        <div
          className="modal show d-block"
          onClick={() => setSelectedImage(null)}
          style={{
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={
                selectedImage.nom?.startsWith("http")
                  ? selectedImage.nom
                  : `https://node-projet-deploy.onrender.com/uploads/${selectedImage.nom}`
              }
              alt={selectedImage.alt}
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
  );
};

export default Mesimages;


