import axios from 'axios';

const BASE_URL = '/.netlify/functions/members';

export const memberApi = {
  getAll: () => axios.get(BASE_URL),
  create: (data) => axios.post(BASE_URL, data),
  // We send the ID as a URL parameter: /.netlify/functions/members?id=123
  delete: (id) => axios.delete(`${BASE_URL}?id=${id}`),
  update: (id, data) => axios.put(`${BASE_URL}?id=${id}`, data)
};