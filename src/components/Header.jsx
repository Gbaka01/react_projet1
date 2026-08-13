import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nom");

    navigate("/login", { replace: true });
  }

  const getNavLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/article/all">
            GOLI Gore Gbaka
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Afficher ou masquer la navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={getNavLinkClass}
                  to="/article/all"
                >
                  Accueil
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={getNavLinkClass}
                  to="/mediatheque"
                >
                  Médiathèque
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={getNavLinkClass}
                  to="/mentions"
                >
                  Mentions légales
                </NavLink>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/mesimages"
                    >
                      Mes images
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/profile"
                    >
                      Profil
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/myarticles"
                    >
                      Mes articles
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/article/new"
                    >
                      Publier un article
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/addimage"
                    >
                      Ajouter une image
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/signaler"
                    >
                      Signaler
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/dashboard"
                    >
                      Modération
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/profile"
                    >
                      Supprimer son compte
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link btn btn-link"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/login"
                    >
                      Se connecter
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={getNavLinkClass}
                      to="/register"
                    >
                      S’inscrire
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}