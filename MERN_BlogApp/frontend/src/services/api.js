import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('inkflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('inkflow_token');
      localStorage.removeItem('inkflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const blogAPI = {
  getAll:        (params)       => API.get('/blogs', { params }),
  getFeatured:   ()             => API.get('/blogs/featured'),
  getTrending:   ()             => API.get('/blogs/trending'),
  getBySlug:     (slug)         => API.get(`/blogs/${slug}`),
  create:        (data)         => API.post('/blogs', data),
  update:        (id, data)     => API.put(`/blogs/${id}`, data),
  remove:        (id)           => API.delete(`/blogs/${id}`),
  like:          (id)           => API.put(`/blogs/${id}/like`),
  bookmark:      (id)           => API.put(`/blogs/${id}/bookmark`),
  addComment:    (id, data)     => API.post(`/blogs/${id}/comments`, data),
  deleteComment: (id, cid)      => API.delete(`/blogs/${id}/comments/${cid}`),
  adminStats:    ()             => API.get('/blogs/admin/stats'),
};

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  me:       ()     => API.get('/auth/me'),
};

export const userAPI = {
  getProfile:    (username) => API.get(`/users/${username}`),
  updateProfile: (data)     => API.put('/users/profile/update', data),
  follow:        (id)       => API.put(`/users/${id}/follow`),
  getBookmarks:  ()         => API.get('/users/me/bookmarks'),
  getAll:        (params)   => API.get('/users', { params }),
};



