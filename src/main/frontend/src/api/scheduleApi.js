import api from '../api';

// 일정 생성
export const createSchedule = async (scheduleData) => {
  // scheduleData: { title, description, startDate, endDate, ... }
  const response = await api.post('/schedule/createSchedule', scheduleData);
  return response.data; // { id: ... }
};

// 일정에 장소 추가
export const addPlaceToSchedule = async (placeData) => {
  // placeData: { name, address, latitude, longitude, scheduleId, dayNumber }
  const response = await api.post('/places/save', placeData);
  return response.data;
};

// Day별 장소 리스트 조회
export const getPlacesByScheduleAndDay = async (scheduleId, dayNumber) => {
  const response = await api.get('/places', {
    params: { scheduleId, dayNumber }
  });
  return response.data; // Place 리스트
};

// 일정에 장소 삭제
export const deletePlaceFromSchedule = async (placeId) => {
  return await api.delete(`/places/${placeId}/delete`);
}; 