import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <main className="notfound">
      {/* React 19 : placés automatiquement dans le <head>.
          React 18 : les mettre dans <Helmet> (react-helmet-async) */}
      <title>Page introuvable | Réseau GOLI Gore Gbaka</title>
      <meta name="robots" content="noindex" />

      <section className="acc-hero notfound-card text-center">
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">Cette page s'est déconnectée…</h1>
        <p className="mb-1">
          L'adresse <code>{pathname}</code> n'existe pas ou a été déplacée.
        </p>
        <p className="text-body-secondary mb-4">
          Pas de panique, la communauté est toujours là.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Link to="/" className="btn btn-dark px-4">Retour à l'accueil</Link>
          <Link to="/connexion" className="btn btn-outline-dark px-4">Se connecter</Link>
        </div>

        <hr className="my-4" />

        <p className="small mb-2">Découvrir aussi :</p>
        <nav className="d-flex flex-wrap justify-content-center gap-3 small">
          <a href="https://www.gbaka.fr/">Mon CV</a>
          <a href="https://www.goligbaka.fr/">Dessins de Goré</a>
          <a href="https://www.bravocuistot-goli.fr/">Bravo Cuistot</a>
        </nav>
      </section>
    </main>
  );
}