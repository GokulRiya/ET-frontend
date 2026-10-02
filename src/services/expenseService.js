import api from './api';

export const createExpense = async (data) => {
    const response = await api.post("/expenses", data);
    return response.data;
}

export const getExpenses = async (search, month) => {
    const response = await api.get("/expenses", { params: { search, month } });
    return response.data;
}

export const getDashboardData = async (month) => {
    const response = await api.get("/expenses/dashboard", { params: { month } });
    return response.data;
}

export const getExpenseById = async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
}

export const updateExpense = async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
}

export const deleteExpense = async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
}