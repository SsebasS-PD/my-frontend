import axios from 'axios';

const API_URL = 'http://localhost:4000/api/media';

export const getMedias = () => axios.get(API_URL);

export const createMedia = (data) => axios.post(API_URL, data);

export const updateMedia = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteMedia = (id) => axios.delete(`${API_URL}/${id}`);
