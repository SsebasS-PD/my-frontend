import axios from 'axios';

// URL base del backend - todas las peticiones de Genero van aquí
const API_URL = 'http://localhost:4000/api/genero';

// GET - obtener todos los géneros
export const getGeneros = () => axios.get(API_URL);

// POST - crear un nuevo género
export const createGenero = (data) => axios.post(API_URL, data);

// PUT - actualizar un género por su ID
export const updateGenero = (id, data) => axios.put(`${API_URL}/${id}`, data);

// DELETE - eliminar un género por su ID
export const deleteGenero = (id) => axios.delete(`${API_URL}/${id}`);
