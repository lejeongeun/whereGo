import api from '../api';

const API_BASE_URL = '/group';

export const checklistApi = {
  // 그룹 관련 API
  createGroup: async (groupData) => {
    const response = await api.post(`${API_BASE_URL}/create`, groupData);
    return response.data;
  },
  
  getAllGroups: async () => {
    const response = await api.get(`${API_BASE_URL}/allList`);
    return response.data;
  },
  
  updateGroup: async (groupId, groupData) => {
    const response = await api.put(`${API_BASE_URL}/${groupId}/edit`, groupData);
    return response.data;
  },
  
  deleteGroup: async (groupId) => {
    const response = await api.delete(`${API_BASE_URL}/${groupId}/delete`);
    return response.data;
  },
  
  // 항목 관련 API
  addItem: async (groupId, itemData) => {
    const response = await api.post(`${API_BASE_URL}/${groupId}/addItem`, itemData);
    return response.data;
  },
  
  updateItem: async (groupId, itemId, itemData) => {
    const response = await api.put(`${API_BASE_URL}/${groupId}/item/${itemId}/edit`, itemData);
    return response.data;
  },
  
  toggleItem: async (groupId, itemId) => {
    const response = await api.put(`${API_BASE_URL}/${groupId}/item/${itemId}/toggle`);
    return response.data;
  },
  
  deleteItem: async (groupId, itemId) => {
    const response = await api.delete(`${API_BASE_URL}/${groupId}/delete/${itemId}`);
    return response.data;
  }
}; 