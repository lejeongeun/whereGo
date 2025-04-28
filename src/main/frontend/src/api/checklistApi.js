import api from '../api';

const API_BASE_URL = '/group';

export const checklistApi = {
  // 그룹 관련 API
  createGroup: async (groupData) => {
    const response = await api.post(`${API_BASE_URL}/create`, groupData);
    return response.data;
  },
  
  getAllGroups: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.get(`${API_BASE_URL}/allList`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  updateGroup: async (groupId, groupData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.put(`${API_BASE_URL}/${groupId}/edit`, groupData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  deleteGroup: async (groupId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.delete(`${API_BASE_URL}/${groupId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  // 항목 관련 API
  addItem: async (groupId, itemData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.post(`${API_BASE_URL}/${groupId}/addItem`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  updateItem: async (groupId, itemId, itemData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.put(`${API_BASE_URL}/${groupId}/item/${itemId}/edit`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  toggleItem: async (groupId, itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.put(`${API_BASE_URL}/${groupId}/item/${itemId}/toggle`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  deleteItem: async (groupId, itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await api.delete(`${API_BASE_URL}/${groupId}/delete/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 