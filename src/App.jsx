import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import ListArticles from './pages/ListArticles';
import Form from './pages/Form';
import Mediatheque from './pages/Mediatheque';
import Mesimages from './pages/Mesimages';
import Mentions from './pages/Mentions';
import ReNewPassword from './pages/ReNewPassword';
import Signaler from './pages/Signaler';
import ReportModal from './pages/ReportModal';
import ModerationDashboard from './pages/ModerationDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MyArticles from './pages/MyArticles';
import EditPage from './pages/EditPage';
import DeleteAccountButton from './pages/DeleteAccountButton';
import Profile from './pages/Profile';
 import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/article/new" element={<CreateArticle />} />
          <Route path="/addimage" element={<Form />} />
          <Route path="/article/all" element={<ListArticles />} />
          <Route path="/mesimages" element={<Mesimages />} />
          <Route path="/mediatheque" element={<Mediatheque />} />
          <Route path="/mentions" element={<Mentions />} />
          <Route path="/renew-password" element={<ReNewPassword />} />
          <Route path="/signaler" element={<Signaler />} />
          <Route path="/reportmodal" element={<ReportModal />} />
          <Route path="/myarticles" element={<MyArticles />} />
          <Route path="/article/edit/:id" element={<EditPage />} />
          <Route path="/delete-account" element={<DeleteAccountButton />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["moderateur", "admin"]}>
                <ModerationDashboard />
              </ProtectedRoute>
            }
          />
          {/* Page 404 pour les adresses inconnues */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center">
                <h1>Page introuvable</h1>
                <p>Cette page n’existe pas.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
 
export default App;
 

