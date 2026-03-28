import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getDirectores,
  createDirector,
  updateDirector,
  deleteDirector
} from '../../services/directorService';

function DirectorPage() {
  const [directores, setDirectores] = useState([]);
  const [form, setForm] = useState({ nombre: '', estado: 'Activo' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarDirectores();
  }, []);

  const cargarDirectores = async () => {
    try {
      const res = await getDirectores();
      setDirectores(res.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los directores', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDirector(editId, form);
        Swal.fire('¡Actualizado!', 'El director fue actualizado.', 'success');
      } else {
        await createDirector(form);
        Swal.fire('¡Creado!', 'El director fue creado.', 'success');
      }
      setForm({ nombre: '', estado: 'Activo' });
      setEditId(null);
      cargarDirectores();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Ocurrió un error', 'error');
    }
  };

  const handleEdit = (director) => {
    setForm({ nombre: director.nombre, estado: director.estado });
    setEditId(director._id);
  };

  const handleCancel = () => {
    setForm({ nombre: '', estado: 'Activo' });
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
        await deleteDirector(id);
        Swal.fire('¡Eliminado!', 'El director fue eliminado.', 'success');
        cargarDirectores();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el director', 'error');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">🎬 Directores</h2>

      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          {editId ? '✏️ Editar Director' : '➕ Nuevo Director'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Christopher Nolan..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Estado *</label>
              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <button type="submit" className="btn btn-dark me-2">
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

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {directores.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted">No hay directores registrados</td>
            </tr>
          ) : (
            directores.map((director) => (
              <tr key={director._id}>
                <td>{director.nombre}</td>
                <td>
                  <span className={`badge ${director.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                    {director.estado}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(director)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(director._id)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DirectorPage;
