import React, { useState } from 'react';
import MapContainer from '../../components/schedule/MapContainer';
import ScheduleList from '../../components/schedule/ScheduleList';
import './TripSchedulePage.css';

function TripSchedulePage() {
 
  const [schedule, setSchedule] = useState([]);

  const handleDeleteFromSchedule = (id) => {
    // 일정 리스트에서 해당 id를 가진 장소만 제거
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  return (
    <div className="trip-schedule-container">
      <div className="left-panel">
        <MapContainer />
      </div>
      <div div className="right-panel">
        <ScheduleList places={schedule} onDelete={handleDeleteFromSchedule}/>
      </div>
    </div>
  );
}

export default TripSchedulePage;