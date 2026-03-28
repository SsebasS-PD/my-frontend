import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Logo / Nombre de la app */}
        <Link className="navbar-brand fw-bold" to="/">
          🎬 MediaApp
        </Link>

        {/* Botón hamburguesa para pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links de navegación */}
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/generos">Géneros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/directores">Directores</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productoras">Productoras</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tipos">Tipos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/medias">
                <span className="badge bg-primary">Media</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
