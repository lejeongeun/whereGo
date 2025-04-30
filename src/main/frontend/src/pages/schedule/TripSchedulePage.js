import React, { useState } from 'react';
import MapContainer from '../../components/schedule/MapContainer';
import ScheduleList from '../../components/schedule/ScheduleList';
import './TripSchedulePage.css';

function TripSchedulePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({
    name: '나고야역',
    description: '나고야 중심부에 위치한 교통 중심지',
  });
  const [schedule, setSchedule] = useState([]);

  const handleSearch = (keyword) => {
    // 검색 로직은 추후 구현
    const dummyResult = {
      id: 1,
      name: keyword,
      description: `${keyword}에 대한 설명입니다.`,
      image: 'https://via.placeholder.com/120',
    };
    setSelectedPlace(dummyResult);
  };

  const handleAddToSchedule = (place) => {
    if (!schedule.find((item) => item.id === place.id)) {
      setSchedule([...schedule, place]);
    }
  };

  const handleDeleteFromSchedule = (id) => {
    // 일정 리스트에서 해당 id를 가진 장소만 제거
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  return (
    <div className="trip-schedule-container">
      <div className="left-panel">
        <MapContainer setSelectedPlace={setSelectedPlace} />
      </div>
      <div div className="right-panel">
        <ScheduleList places={schedule} onDelete={handleDeleteFromSchedule}/>
      </div>
    </div>
  );
}

export default TripSchedulePage;