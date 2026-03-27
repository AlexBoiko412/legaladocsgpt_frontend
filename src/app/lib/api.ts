import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const GOOGLE_AUTH_URL = `${API_BASE}/api/auth/oauth2/authorization/google`;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});


export const authApi = {
    me: () => api.get('/api/auth/me'),
    login: (data: { username?: string; email?: string; password: string }) =>
        api.post('/api/auth/login', data),
    signup: (data: { username: string; email: string; password: string }) =>
        api.post('/api/auth/signup', data),
    logout: () => api.post('/api/auth/logout'),
};


export const documentsApi = {
    getAll: (search?: string) =>
        api.get('/api/documents', { params: { search } }),
    getStatus: (jobId: string) =>
        api.get(`/api/documents/status/${jobId}`),
    generate: (body: { templateId: string; format?: string; data: Record<string, string> }) =>
        api.post('/api/documents/generate', body),
    rename: (jobId: string, title: string) =>
        api.patch(`/api/documents/${jobId}/title`, { title }),
    delete: (jobId: string) =>
        api.delete(`/api/documents/${jobId}`),
    getEditorConfig: (jobId: string) =>
        api.get(`/api/documents/${jobId}/editor-config`),
    finalize: (jobId: string, refinementPrompt?: string) =>
        api.post(`/api/documents/${jobId}/finalize`, { refinementPrompt }),
    convertToPdf: (jobId: string) =>
        api.post(`/api/documents/${jobId}/convert`),
};


export const templatesApi = {
    getAll: () => api.get('/api/templates'),
    getById: (id: string) => api.get(`/api/templates/${id}`),
};


export const storageApi = {
    downloadUrl: (key: string) =>
        `${API_BASE}/api/storage/download-raw?key=${key}`,
};