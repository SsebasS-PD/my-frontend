import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getGeneros,
  createGenero,
  updateGenero,
  deleteGenero
} from '../../services/generoService';

function GeneroPage() {
  // --- ESTADO ---
  // Lista de géneros que viene del backend
  const [generos, setGeneros] = useState([]);
  // Datos del formulario
  const [form, setForm] = useState({ nombre: '', descripcion: '', estado: 'Activo' });
  // Si estamos editando, guardamos el ID aquí; si es null, estamos creando
  const [editId, setEditId] = useState(null);

  // --- CARGAR DATOS ---
  // useEffect se ejecuta cuando el componente carga por primera vez
  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const res = await getGeneros();
      setGeneros(res.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los géneros', 'error');
    }
  };

  // --- MANEJAR CAMBIOS EN EL FORMULARIO ---
  // Cada vez que el usuario escribe algo, actualizamos el estado
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- GUARDAR (Crear o Actualizar) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    try {
      if (editId) {
        // Si tenemos un ID, actualizamos
        await updateGenero(editId, form);
        Swal.fire('¡Actualizado!', 'El género fue actualizado.', 'success');
      } else {
        // Si no hay ID, creamos
        await createGenero(form);
        Swal.fire('¡Creado!', 'El género fue creado.', 'success');
      }
      // Limpiamos el formulario y recargamos la lista
      setForm({ nombre: '', descripcion: '', estado: 'Activo' });
      setEditId(null);
      cargarGeneros();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Ocurrió un error', 'error');
    }
  };

  // --- CARGAR DATOS EN EL FORMULARIO PARA EDITAR ---
  const handleEdit = (genero) => {
    setForm({
      nombre: genero.nombre,
      descripcion: genero.descripcion || '',
      estado: genero.estado
    });
    setEditId(genero._id);
  };

  // --- CANCELAR EDICIÓN ---
  const handleCancel = () => {
    setForm({ nombre: '', descripcion: '', estado: 'Activo' });
    setEditId(null);
  };

  // --- ELIMINAR ---
  const handleDelete = async (id) => {
    // SweetAlert2 muestra una confirmación antes de eliminar
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
        await deleteGenero(id);
        Swal.fire('¡Eliminado!', 'El género fue eliminado.', 'success');
        cargarGeneros();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el género', 'error');
      }
    }
  };

  // --- RENDERIZADO ---
  return (
    <div>
      <h2 className="mb-4">🎭 Géneros</h2>

      {/* FORMULARIO */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          {editId ? '✏️ Editar Género' : '➕ Nuevo Género'}
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
                placeholder="Ej: Acción, Comedia..."
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

      {/* TABLA DE GÉNEROS */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {generos.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay géneros registrados
              </td>
            </tr>
          ) : (
            generos.map((genero) => (
              <tr key={genero._id}>
                <td>{genero.nombre}</td>
                <td>{genero.descripcion || '-'}</td>
                <td>
                  <span className={`badge ${genero.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                    {genero.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(genero)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(genero._id)}
                  >
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

export default GeneroPage;
