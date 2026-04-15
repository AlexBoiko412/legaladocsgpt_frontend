import axios from 'axios';

if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_API_URL) {
    console.error('[api] NEXT_PUBLIC_API_URL is not set. Requests will fall back to localhost, which will fail in production.');
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
export const GOOGLE_AUTH_URL = `${API_BASE}/api/auth/oauth2/authorization/google`;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 401 &&
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/forgot-password') &&
            !window.location.pathname.startsWith('/reset-password')
    ) {
            const next = encodeURIComponent(window.location.pathname);
            window.location.href = `/login?next=${next}`;
        }
        return Promise.reject(error);
    }
);


export const authApi = {
    me: () => api.get('/api/auth/me'),
    login: (data: { username?: string; email?: string; password: string }) =>
        api.post('/api/auth/login', data),
    signup: (data: { username: string; email: string; password: string }) =>
        api.post('/api/auth/signup', data),
    logout: () => api.post('/api/auth/logout'),
    changePassword: (currentPassword: string, newPassword: string) =>
        api.patch('/api/auth/me/password', { currentPassword, newPassword }),
    forgotPassword: (email: string) =>
        api.post('/api/auth/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) =>
        api.post('/api/auth/reset-password', { token, newPassword }),
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
    getVersions: (jobId: string) =>
        api.get(`/api/documents/${jobId}/versions`),
    restoreVersion: (jobId: string, version: number) =>
        api.post(`/api/documents/${jobId}/versions/${version}/restore`),
};


export const templatesApi = {
    getAll: () => api.get('/api/templates'),
    getById: (id: string) => api.get(`/api/templates/${id}`),
    create: (formData: FormData) =>
        api.post('/api/templates/admin', formData),
    update: (id: string, formData: FormData) =>
        api.put(`/api/templates/admin/${id}`, formData),
    delete: (id: string) =>
        api.delete(`/api/templates/admin/${id}`),
};


export const storageApi = {
    downloadUrl: (key: string) =>
        `${API_BASE}/api/storage/download-raw?key=${encodeURIComponent(key)}`,
};
