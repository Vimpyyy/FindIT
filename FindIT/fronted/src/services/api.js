import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change this if your backend URL is different

// User Authentication
export const registerUser = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const getUserProfile = (token) => axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
});

// Lost Items CRUD
export const addLostItem = (lostItemData, token) => axios.post(`${API_URL}/lost-items`, lostItemData, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updateLostItem = (id, updatedData, token) => axios.put(`${API_URL}/lost-items/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
});
export const deleteLostItem = (id, token) => axios.delete(`${API_URL}/lost-items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getLostItems = () => axios.get(`${API_URL}/lost-items`);

// Found Items CRUD
export const addFoundItem = (foundItemData, token) => axios.post(`${API_URL}/found-items`, foundItemData, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updateFoundItem = (id, updatedData, token) => axios.put(`${API_URL}/found-items/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
});
export const deleteFoundItem = (id, token) => axios.delete(`${API_URL}/found-items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getFoundItems = () => axios.get(`${API_URL}/found-items`);

// Send Notification
export const sendNotification = (email, itemName) => axios.post(`${API_URL}/notify`, { email, itemName });
