import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getMedias, createMedia, updateMedia, deleteMedia } from '../../services/mediaService';
import { getGeneros } from '../../services/generoService';
import { getDirectores } from '../../services/directorService';
import { getProductoras } from '../../services/productoraService';
import { getTipos } from '../../services/tipoService';

// Estado inicial del formulario vacío
const FORM_VACIO = {
  serial: '', titulo: '', sinopsis: '', url: '',
  imagen: '', anioEstreno: '', genero: '', director: '',
  productora: '', tipo: ''
};

function MediaPage() {
  const [medias, setMedias] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editId, setEditId] = useState(null);

  // Listas para los selectores desplegables (vienen del backend)
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Al cargar la página, traemos medias Y las listas de selects
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Hacemos todas las peticiones en paralelo con Promise.all (más rápido)
      const [resMedias, resGeneros, resDirectores, resProductoras, resTipos] = await Promise.all([
        getMedias(), getGeneros(), getDirectores(), getProductoras(), getTipos()
      ]);
      setMedias(resMedias.data);
      setGeneros(resGeneros.data);
      setDirectores(resDirectores.data);
      setProductoras(resProductoras.data);
      setTipos(resTipos.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateMedia(editId, form);
        Swal.fire('¡Actualizado!', 'La media fue actualizada.', 'success');
      } else {
        await createMedia(form);
        Swal.fire('¡Creado!', 'La media fue creada.', 'success');
      }
      setForm(FORM_VACIO);
      setEditId(null);
      cargarDatos();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Ocurrió un error', 'error');
    }
  };

  const handleEdit = (media) => {
    setForm({
      serial: media.serial,
      titulo: media.titulo,
      sinopsis: media.sinopsis,
      url: media.url,
      imagen: media.imagen || '',
      anioEstreno: media.anioEstreno,
      // Para editar, usamos el _id del objeto relacionado (que fue populado)
      genero: media.genero?._id || '',
      director: media.director?._id || '',
      productora: media.productora?._id || '',
      tipo: media.tipo?._id || ''
    });
    setEditId(media._id);
  };

  const handleCancel = () => {
    setForm(FORM_VACIO);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        await deleteMedia(id);
        Swal.fire('¡Eliminado!', 'La media fue eliminada.', 'success');
        cargarDatos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la media', 'error');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">🎥 Media</h2>

      {/* FORMULARIO */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          {editId ? '✏️ Editar Media' : '➕ Nueva Media'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Columna izquierda */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Serial *</label>
                  <input type="text" className="form-control" name="serial"
                    value={form.serial} onChange={handleChange} required
                    placeholder="Ej: 001" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Título *</label>
                  <input type="text" className="form-control" name="titulo"
                    value={form.titulo} onChange={handleChange} required
                    placeholder="Ej: Inception" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sinopsis *</label>
                  <textarea className="form-control" name="sinopsis"
                    value={form.sinopsis} onChange={handleChange} required
                    rows="3" placeholder="Descripción de la película..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">Año de Estreno *</label>
                  <input type="number" className="form-control" name="anioEstreno"
                    value={form.anioEstreno} onChange={handleChange} required
                    placeholder="Ej: 2010" min="1888" max="2100" />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">URL *</label>
                  <input type="text" className="form-control" name="url"
                    value={form.url} onChange={handleChange} required
                    placeholder="https://..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL Imagen</label>
                  <input type="text" className="form-control" name="imagen"
                    value={form.imagen} onChange={handleChange}
                    placeholder="https://imagen.jpg (opcional)" />
                </div>

                {/* SELECTORES DE RELACIONES - aquí se conecta con los otros módulos */}
                <div className="mb-3">
                  <label className="form-label">Género *</label>
                  <select className="form-select" name="genero"
                    value={form.genero} onChange={handleChange} required>
                    <option value="">-- Seleccionar Género --</option>
                    {generos.map(g => (
                      <option key={g._id} value={g._id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Director *</label>
                  <select className="form-select" name="director"
                    value={form.director} onChange={handleChange} required>
                    <option value="">-- Seleccionar Director --</option>
                    {directores.map(d => (
                      <option key={d._id} value={d._id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Productora *</label>
                  <select className="form-select" name="productora"
                    value={form.productora} onChange={handleChange} required>
                    <option value="">-- Seleccionar Productora --</option>
                    {productoras.map(p => (
                      <option key={p._id} value={p._id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo *</label>
                  <select className="form-select" name="tipo"
                    value={form.tipo} onChange={handleChange} required>
                    <option value="">-- Seleccionar Tipo --</option>
                    {tipos.map(t => (
                      <option key={t._id} value={t._id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>

      {/* TABLA DE MEDIAS */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>Serial</th>
              <th>Título</th>
              <th>Año</th>
              <th>Género</th>
              <th>Director</th>
              <th>Productora</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medias.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">No hay medias registradas</td>
              </tr>
            ) : (
              medias.map((media) => (
                <tr key={media._id}>
                  <td><code>{media.serial}</code></td>
                  <td><strong>{media.titulo}</strong></td>
                  <td>{media.anioEstreno}</td>
                  {/* El backend ya hizo populate, así que accedemos directamente al .nombre */}
                  <td>{media.genero?.nombre || '-'}</td>
                  <td>{media.director?.nombre || '-'}</td>
                  <td>{media.productora?.nombre || '-'}</td>
                  <td>{media.tipo?.nombre || '-'}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(media)}>
                      ✏️ Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(media._id)}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MediaPage;
