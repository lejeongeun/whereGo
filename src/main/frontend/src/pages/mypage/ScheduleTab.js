import React, { useState, useEffect } from 'react';
import api from '../../api';

const ScheduleTab = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedulePlaces, setSchedulePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

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
      setSelectedDay(null); // 일정 변경 시 선택된 일차 초기화
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
  
  // 날짜 포맷 함수 (YYYY-MM-DD 형식으로 변환)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 일정 기간 계산 (일 수 반환)
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일 포함
    return diffDays;
  };
  
  // 일차별 장소 그룹화
  const groupPlacesByDay = (places) => {
    if (!places || places.length === 0) return {};
    
    // day_number를 키로 하여 장소를 그룹화
    return places.reduce((acc, place) => {
      // 여러 가능한 필드명 시도
      const dayNumber = place.day_number || place.dayNumber || place.day || place.placeDay || 1;
      
      if (!acc[dayNumber]) {
        acc[dayNumber] = [];
      }
      
      acc[dayNumber].push(place);
      return acc;
    }, {});
  };
  
  // 특정 일차 선택 핸들러
  const handleDaySelect = (dayNumber) => {
    setSelectedDay(dayNumber === selectedDay ? null : dayNumber); // 같은 일차 버튼 클릭시 토글
  };
  
  // 오류 처리
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  // 일차별로 그룹화된 장소 데이터
  const placesByDay = groupPlacesByDay(schedulePlaces);
  
  // 일차 버튼 렌더링
  const renderDayButtons = () => {
    if (!selectedSchedule || !schedulePlaces.length) return null;
    
    const dayNumbers = Object.keys(placesByDay).sort((a, b) => Number(a) - Number(b));
    
    return (
      <div className="day-buttons">
        {dayNumbers.map(day => (
          <button 
            key={day} 
            className={`day-button ${selectedDay === day ? 'active' : ''}`} 
            onClick={() => handleDaySelect(day)}
          >
            {day}일차
          </button>
        ))}
      </div>
    );
  };
  
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
                    {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
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
          
          {/* 일차 선택 버튼 */}
          {renderDayButtons()}
          
          {schedulePlaces.length > 0 ? (
            <div className="places-by-day">
              {Object.keys(placesByDay)
                .sort((a, b) => Number(a) - Number(b))
                .filter(dayNumber => selectedDay === null || selectedDay === dayNumber)
                .map(dayNumber => (
                  <div key={dayNumber} className="day-section">
                    <h4 className="day-title">{dayNumber}일차</h4>
                    <div className="places-list">
                      {placesByDay[dayNumber].map(place => (
                        <div key={place.id} className="place-item">
                          <h4>{place.name}</h4>
                          <div className="place-address">{place.address}</div>
                          {place.category && (
                            <div className="place-category">카테고리: {place.category}</div>
                          )}
                        </div>
                      ))}
                    </div>
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