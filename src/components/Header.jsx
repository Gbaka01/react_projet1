import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()

  function handleClick() {
    localStorage.removeItem("token")
    navigate("/login") // après déconnexion, redirection vers login
  }

  const isLoggedIn = !!localStorage.getItem("token")

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">GOLI Gore Gbaka</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">

              <li className="nav-item">
                <a className="nav-link active" onClick={() => navigate('/article/all')}>Accueil</a>
              </li>
                  <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/mediatheque')}>Médiathèque</a>
              </li>
                  <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/mentions')}>Mentions legales</a>
              </li>  
            
            

              

              {/* Liens conditionnels selon token */}
              {isLoggedIn ? (
                <>
                     <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/mesimages')}>Mes images</a>
              </li>
                  <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/')}>Profil</a>
              </li>
                  <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/myarticles')}>Mes Articles</a>
              </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate('/article/new')}>Publier un article</a>
                  </li>
              
                   <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate('/addimage')}>Ajouter une image</a>
                  </li>
                       <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate('/signaler')}>Signaler</a>
                  </li>
                        <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate('/dashboard')}>Moderation</a>
                  </li>
                      <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate ('/profile')}>Supprimer son compte</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleClick}>Se déconnecter</a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate('/login')}>Se connecter</a>
                  </li>
                  <li className="nav-item ">
                    <a className="nav-link" onClick={() => navigate('/register')}>S’inscrire</a>
                  </li>
                </>
              )}
            </ul>

      
          </div>
        </div>
      </nav>
    </header>
  )
}
