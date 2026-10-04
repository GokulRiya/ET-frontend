import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (isExpired) {
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                window.location.href = "/unauthorized";
                return Promise.reject(new Error("Token expired"));
            }
        } catch (error) {
            // If token is invalid, let it pass or handle it here
            console.error("Invalid token format");
        }
        
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const isLoginRequest = error.config?.url?.endsWith('/auth/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");

            window.location.href = "/unauthorized"
        }

        return Promise.reject(error);
    }
)
export default api;