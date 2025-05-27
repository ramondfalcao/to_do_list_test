import axios from 'axios';

const HOST = process.env.HOST_API || 'http://localhost:3001/';

const api = axios.create({
  baseURL: HOST,
});

export const validateToken = async () => {
  try {
    const response = await api.get('/auth/validate-token');
    return response.data;
  } catch (error) {
    console.error('Erro ao validar token:', error.message);
    throw error;
  }
};

export const setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getToken = () => {
  try {
    const tokenResponse = localStorage.getItem('token');
    
    if (tokenResponse) {
      return tokenResponse;
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter token do localStorage:', error);
    return null;
  }
};

export async function requestData(endpoint) {
  const { data } = await api.get(endpoint);
  return data;
};

export const requestPost = async (endpoint, body) => {
  const { data } = await api.post(endpoint, body);
  return data;
};

export const requestUpdate = async (endpoint, body) => {
  const { data } = await api.patch(endpoint, body);
  return data;
};

export const requestDelete = async (endpoint) => {
  const { data } = await api.delete(endpoint);
  return data;
};


export default api;