import React, { useState, useEffect } from 'react';
import api from '../../api';

const ScheduleTab = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedulePlaces, setSchedulePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 첫 렌더링 시 일정 데이터 가져오기
  useEffect(() => {
    fetchSchedules();
  }, []);
  
  // 일정 데이터 가져오기
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      // 컨트롤러의 allPlaces 엔드포인트 사용
      const response = await api.get('/schedule/allPlaces', {
        withCredentials: true
      });
      
      setScheduleItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('일정 데이터 로드 실패:', err);
      setError('일정을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 일정에 등록된 장소 가져오기
  const fetchSchedulePlaces = async (scheduleId) => {
    try {
      // 컨트롤러의 getPlaces 엔드포인트 사용
      const response = await api.get(`/schedule/${scheduleId}/getPlaces`, {
        withCredentials: true
      });
      
      setSchedulePlaces(response.data);
    } catch (err) {
      console.error('일정 장소 데이터 로드 실패:', err);
      setError('일정의 장소 정보를 불러오는데 실패했습니다.');
      setSchedulePlaces([]);
    }
  };

  // 일정 선택 핸들러
  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    fetchSchedulePlaces(schedule.id);
  };
  
  // 로딩 중 처리
  if (loading) {
    return <div className="loading">일정을 불러오는 중입니다...</div>;
  }

  // 오류 처리
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="schedule-section">
      <h2>내 일정 목록</h2>
      
      {/* 일정 목록 */}
      <div className="schedule-list">
        {scheduleItems.length > 0 ? (
          <div className="schedules-container">
            {scheduleItems
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
              .map(item => (
                <div 
                  key={item.id} 
                  className={`schedule-item ${selectedSchedule?.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleScheduleSelect(item)}
                >
                  <div className="schedule-header">
                    <h3>{item.title}</h3>
                  </div>
                  <div className="schedule-date">
                    {item.startDate} ~ {item.endDate}
                  </div>
                  {item.description && (
                    <div className="schedule-description">{item.description}</div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className="no-items">일정이 없습니다.</p>
        )}
      </div>

      {/* 선택된 일정의 장소 표시 */}
      {selectedSchedule && (
        <div className="schedule-places">
          <h3>"{selectedSchedule.title}" 일정의 장소</h3>
          
          {schedulePlaces.length > 0 ? (
            <div className="places-list">
              {schedulePlaces.map(place => (
                <div key={place.id} className="place-item">
                  <h4>{place.name}</h4>
                  <div className="place-address">{place.address}</div>
                  {place.category && (
                    <div className="place-category">카테고리: {place.category}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">등록된 장소가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;