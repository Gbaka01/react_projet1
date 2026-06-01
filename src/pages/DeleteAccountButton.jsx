import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeleteAccountButton() {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete("https://node-projet-deploy.onrender.com/user/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      alert("Votre compte a été supprimé.");

      navigate("/");
    } catch (error) {
      alert("Erreur lors de la suppression du compte.");
    }
  };

  return (
    <button className="btn btn-danger" onClick={handleDeleteAccount}>
      Supprimer mon compte
    </button>
  );
}

export default DeleteAccountButton;