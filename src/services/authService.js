import { useContext } from "react"
import api from "./api"

export const register = async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
}
export const login = async (data) => {
    const response = await api.post('/auth/login', data)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('name', response.data.name)
    localStorage.setItem('email', response.data.email)
    return response.data
}

export const getUsers = async () => {
    const response = await api.get("/auth");
    return response.data;
}

export const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
}

export const getToken = () => {
    return localStorage.getItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};