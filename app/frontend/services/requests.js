import axios from 'axios';

const HOST = process.env.HOST_API || 'http://localhost:3001/';

const api = axios.create({
  baseURL: HOST,
});

export const validateToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const response = await api.get('/validateToken', config);
    return response.data;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    throw error;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    const tokenParse = JSON.parse(token);

    if (tokenParse) {
      return tokenParse;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter token do localStorage:', error);
    return null;
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get('/validateToken');
    return response.data;
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
  const { data } = await api.put(endpoint, body);
  return data;
};

export const requestDelete = async (endpoint) => {
  const { data } = await api.delete(endpoint);
  return data;
};


export default api;