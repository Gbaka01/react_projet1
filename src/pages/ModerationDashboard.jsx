// pages/ModerationDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ModerationDashboard() {
  const [reports, setReports] = useState([]); // ✅ tableau vide
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://node-projet-deploy-1.onrender.com/report", { // ✅ bonne route
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Vérifie que res.data est un tableau
        if (Array.isArray(res.data)) {
          setReports(res.data);
        } else if (res.data.reports) {
          setReports(res.data.reports);
        } else {
          console.warn("Format de réponse inattendu :", res.data);
          setReports([]);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
        setError(err.response?.data?.message || "Erreur serveur");
      })
      .finally(() => setLoading(false));
  }, [token]);

const updateStatus = async (id, status) => {
  try {
    console.log("📡 Mise à jour :", id, status);
    const res = await axios.put(
      `https://node-projet-deploy-1.onrender.com/report/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Réponse :", res.data);
    setReports((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour :", err.response || err);
    alert(
      err.response?.data?.message ||
        "Impossible de mettre à jour le statut (erreur serveur)"
    );
  }
};


  if (loading) return <p>Chargement des signalements...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard">
      <h2>Signalements d’articles</h2>
      {reports.length === 0 ? (
        <p>Aucun signalement trouvé.</p>
      ) : (
        reports.map((r) => (
          <div key={r._id} className="card">
            <p><b>Article :</b> {r.article?.titre || "Inconnu"}</p>
            <p>
  <b>Raisons :</b>{" "}
  {Array.isArray(r.raisons)
    ? r.raisons.join(", ")
    : r.raisons || "—"}
</p>
<p> <b>Auteur de l'article:</b> {/* ✅ Affichage du nom de l’auteur signalé */}
                {r.articleAuteur || "Auteur inconnu"}</p>

            <p><b>Description :</b> {r.description || "—"}</p>
            
              <>
                <div>
  <button
    onClick={() => updateStatus(r._id, "approuvé")}
    disabled={r.status === "approuvé"}
  >
    ✅ Approuver
  </button>
  <button
    onClick={() => updateStatus(r._id, "rejeté")}
    disabled={r.status === "rejeté"}
  >
    ❌ Rejeter
  </button>
</div>

              </>
            
          </div>
        ))
      )}
    </div>
  );
}

