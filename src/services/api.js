import axios from 'axios';

// Em produção, use a URL do Render
const API_URL = 'https://backend-receitas-z7ii.onrender.com/api/receitas';

// Para desenvolvimento local, descomente e use o IP da sua máquina:
// const API_URL = 'http://192.168.X.X:3000/api/receitas';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.message);
    } else {
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

/* ============================
   Funções CRUD (MongoDB Atlas)
   ============================ */
export const listarReceitas = () => api.get('/');
export const buscarReceita = (id) => api.get(`/${id}`);
export const criarReceita = (data) => api.post('/', data);
export const atualizarReceita = (id, data) => api.put(`/${id}`, data);
export const excluirReceita = (id) => api.delete(`/${id}`);

/* ============================
   Funções externas (TheMealDB)
   ============================ */
export const buscarReceitaPorNome = (nome) => api.get(`/nome/${nome}`);
export const buscarReceitaExternaPorId = (id) => api.get(`/external/${id}`);
export const listarCategorias = () => api.get('/categorias');
export const filtrarPorCategoria = (cat) => api.get(`/categoria/${cat}`);

export default api;
