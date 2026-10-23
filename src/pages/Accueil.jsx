import { Link } from "react-router-dom";
import "../css/accueil.css";
 
const features = [
  { icon: "👥", title: "Communauté", text: "Retrouvez vos amis et rencontrez de nouveaux membres." },
  { icon: "💬", title: "Messagerie", text: "Échangez en privé, en toute simplicité." },
  { icon: "📸", title: "Partage", text: "Publiez vos photos, vos créations et vos idées." },
];
 
// Le menu (Header) et le pied de page (Footer) viennent de App.jsx
export default function Accueil() {
  const connecte = !!localStorage.getItem("token");
 
  return (
    <div className="accueil">
      <section className="acc-hero">
        <h1>Bienvenue sur le réseau social <span>GOLI Gore Gbaka</span></h1>
        <p>Partagez, échangez et restez connecté avec votre communauté.</p>
        <div className="acc-hero-actions">
          {connecte ? (
            <>
              <Link to="/article/all" className="acc-btn acc-btn-lg">Voir les articles</Link>
              <Link to="/article/new" className="acc-btn acc-btn-lg acc-btn-outline">Publier un article</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="acc-btn acc-btn-lg">Créer un compte</Link>
              <Link to="/login" className="acc-btn acc-btn-lg acc-btn-outline">Se connecter</Link>
            </>
          )}
        </div>
      </section>
 
      <section className="acc-features">
        {features.map((f) => (
          <article key={f.title} className="acc-card">
            <div className="acc-card-icon" aria-hidden="true">{f.icon}</div>
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
 
