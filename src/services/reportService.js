import api from "./api";

export const getMonthlyReport = async (month)=>{
    try{
        const response = await api.get(`/reports/monthly?month=${month}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly report:", error);
        throw error;
    }
}