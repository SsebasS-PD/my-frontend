import axios from 'axios';

const API_URL = 'http://localhost:4000/api/productora';

export const getProductoras = () => axios.get(API_URL);

export const createProductora = (data) => axios.post(API_URL, data);

export const updateProductora = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteProductora = (id) => axios.delete(`${API_URL}/${id}`);
