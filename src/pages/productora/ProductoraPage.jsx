import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getProductoras,
  createProductora,
  updateProductora,
  deleteProductora
} from '../../services/productoraService';

function ProductoraPage() {
  const [productoras, setProductoras] = useState([]);
  const [form, setForm] = useState({ nombre: '', slogan: '', descripcion: '', estado: 'Activo' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarProductoras();
  }, []);

  const cargarProductoras = async () => {
    try {
      const res = await getProductoras();
      setProductoras(res.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las productoras', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProductora(editId, form);
        Swal.fire('¡Actualizado!', 'La productora fue actualizada.', 'success');
      } else {
        await createProductora(form);
        Swal.fire('¡Creado!', 'La productora fue creada.', 'success');
      }
      setForm({ nombre: '', slogan: '', descripcion: '', estado: 'Activo' });
      setEditId(null);
      cargarProductoras();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.msg || 'Ocurrió un error', 'error');
    }
  };

  const handleEdit = (productora) => {
    setForm({
      nombre: productora.nombre,
      slogan: productora.slogan || '',
      descripcion: productora.descripcion || '',
      estado: productora.estado
    });
    setEditId(productora._id);
  };

  const handleCancel = () => {
    setForm({ nombre: '', slogan: '', descripcion: '', estado: 'Activo' });
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
        await deleteProductora(id);
        Swal.fire('¡Eliminado!', 'La productora fue eliminada.', 'success');
        cargarProductoras();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la productora', 'error');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">🏢 Productoras</h2>

      <div className="card mb-4">
        <div className="card-header bg-dark text-white">
          {editId ? '✏️ Editar Productora' : '➕ Nueva Productora'}
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
                placeholder="Ej: Warner Bros..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Slogan *</label>
              <input
                type="text"
                className="form-control"
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
                required
                placeholder="Ej: The one studio..."
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

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Slogan</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productoras.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">No hay productoras registradas</td>
            </tr>
          ) : (
            productoras.map((productora) => (
              <tr key={productora._id}>
                <td>{productora.nombre}</td>
                <td>{productora.slogan}</td>
                <td>{productora.descripcion || '-'}</td>
                <td>
                  <span className={`badge ${productora.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                    {productora.estado}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(productora)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(productora._id)}>
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

export default ProductoraPage;
