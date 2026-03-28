import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center py-5">
      <h1>🎬 Bienvenido a MediaApp</h1>
      <p className="lead text-muted">Gestiona tu catálogo de películas y series</p>
      <Link to="/medias" className="btn btn-primary btn-lg mt-3">
        Ver Catálogo de Media
      </Link>
    </div>
  );
}

export default Home;
