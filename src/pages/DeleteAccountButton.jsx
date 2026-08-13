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

      if (!token) {
        alert("Vous devez être connecté.");
        navigate("/login");
        return;
      }

      await axios.delete(
        "https://node-projet-deploy-1.onrender.com/user/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Votre compte a été supprimé.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du compte.");
    }
  };

  return (
    <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>
      Supprimer mon compte
    </button>
  );
}

export default DeleteAccountButton;