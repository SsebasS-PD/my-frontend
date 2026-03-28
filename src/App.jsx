import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GeneroPage from './pages/genero/GeneroPage';
import DirectorPage from './pages/director/DirectorPage';
import ProductoraPage from './pages/productora/ProductoraPage';
import TipoPage from './pages/tipo/TipoPage';
import MediaPage from './pages/media/MediaPage';

function App() {
  return (
    <>
      {/* La Navbar aparece en todas las páginas */}
      <Navbar />

      {/* Contenedor principal con espacio arriba */}
      <div className="container mt-4">
        {/* Routes define qué componente mostrar según la URL */}
        <Routes>
          <Route path="/" element={<GeneroPage />} />
          <Route path="/generos" element={<GeneroPage />} />
          <Route path="/directores" element={<DirectorPage />} />
          <Route path="/productoras" element={<ProductoraPage />} />
          <Route path="/tipos" element={<TipoPage />} />
          <Route path="/medias" element={<MediaPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
