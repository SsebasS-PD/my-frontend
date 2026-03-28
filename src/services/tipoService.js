import axios from 'axios';

const API_URL = 'https://my-backend-ssebass.onrender.com/api/tipo';

export const getTipos = () => axios.get(API_URL);

export const createTipo = (data) => axios.post(API_URL, data);

export const updateTipo = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteTipo = (id) => axios.delete(`${API_URL}/${id}`);
