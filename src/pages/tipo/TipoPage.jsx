import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo
} from '../../services/tipoService';

function TipoPage() {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      const res = await getTipos();
      setTipos(res.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los tipos', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateTipo(editId, form);
        Swal.fire('¡Actualizado!', 'El tipo fue actualizado.', 'success');
      } else {
        await createTipo(form);
        Swal.fire('¡Creado!', 'El tipo fue creado.', 'success');
      }
      setForm({ nombre: '', descripcion: '' });
      setEditId(null);
      cargarTipos();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Ocurrió un error', 'error');
    }
  };

  const handleEdit = (tipo) => {
    setForm({ nombre: tipo.nombre, descripcion: tipo.descripcion || '' });
    setEditId(tipo._id);
  };

  const handleCancel = () => {
    setForm({ nombre: '', descripcion: '' });
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
        await deleteTipo(id);
        Swal.fire('¡Eliminado!', 'El tipo fue eliminado.', 'success');
        cargarTipos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el tipo', 'error');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">📂 Tipos</h2>

      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          {editId ? '✏️ Editar Tipo' : '➕ Nuevo Tipo'}
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
                placeholder="Ej: Película, Serie, Documental..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows="2"
                placeholder="Descripción opcional..."
              />
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
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted">No hay tipos registrados</td>
            </tr>
          ) : (
            tipos.map((tipo) => (
              <tr key={tipo._id}>
                <td>{tipo.nombre}</td>
                <td>{tipo.descripcion || '-'}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(tipo)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tipo._id)}>
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

export default TipoPage;
