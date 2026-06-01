import { useState } from "react";

export default function ReportModal({ article, onClose, onSubmit }) {
  const [raisons, setRaisons] = useState("");
  const [description, setDescription] = useState("");

  const raisonsList = [
    "Contenu offensant",
    "Discours de haine",
    "Spam ou publicité",
    "Fake news / Désinformation",
    "Autre",
  ];

  const toggleReason = (raison) => {
    // setRaisons((prev) =>
    //   prev.includes(raison)
    //     ? prev.filter((r) => r !== raison)
    //     : [...prev, raison]
    // );
    setRaisons(raison);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (raisons.length === 0) {
      alert("Veuillez choisir au moins une raison 🙏");
      return;
    }

    // ✅ correction ici : description à la place de details
    onSubmit(article, raisons, description);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h3 className="mb-3 text-center">🚩 Signaler l’article</h3>

        <form onSubmit={handleSubmit}>
          {raisonsList.map((raison) => (
            <div key={raison}>
            <label style={{ display: "block", marginBottom: "6px" }}>
            </label>
              <input
                // name="raison"
                type="radio"
                checked={raisons.includes(raison)}
                onChange={() => toggleReason(raison)}
              />{" "}
              {raison}
              </div>
          ))}

          <textarea
            className="form-control my-3"
            placeholder="Description (facultative)"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-danger">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

