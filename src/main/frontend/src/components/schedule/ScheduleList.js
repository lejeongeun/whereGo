// src/components/schedule/ScheduleList.js
import React from 'react';
import './schedule.css';

function ScheduleList({ places, onDelete }) {
  return (
    <div className="schedule-list">
      <h3>내 일정</h3>
      {places.length === 0 ? (
        <p>추가된 일정이 없습니다.</p>
      ) : (
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              <div className="list-item-header">
                <strong>{place.name}</strong>
                <button onClick={() => onDelete(place.id)}>❌</button>
              </div>
              <p>{place.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ScheduleList;