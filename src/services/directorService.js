import axios from 'axios';

const API_URL = 'http://localhost:4000/api/director';

export const getDirectores = () => axios.get(API_URL);

export const createDirector = (data) => axios.post(API_URL, data);

export const updateDirector = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteDirector = (id) => axios.delete(`${API_URL}/${id}`);
