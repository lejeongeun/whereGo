import React from 'react';
import './MapPlaceInfoCard.css';

function MapPlaceInfoCard({ place, onAdd }) {
  if (!place) return null;

  // 장소 상세 정보가 있는 경우 추가 정보 표시
  const hasDetails = place.details !== undefined;
  
  return (
    <div className="map-place-info-card">
      <h3>{place.name}</h3>
      <p className="address">{place.address}</p>
      
      {place.rating && (
        <div className="rating">
          <span className="rating-star">★</span>
          <span>{place.rating.toFixed(1)}</span>
        </div>
      )}

      {hasDetails && place.details.formattedPhoneNumber && (
        <p className="phone">📞 {place.details.formattedPhoneNumber}</p>
      )}
      
      {hasDetails && place.details.website && (
        <p className="website">
          <a href={place.details.website} target="_blank" rel="noopener noreferrer">
            웹사이트 방문
          </a>
        </p>
      )}
      
      {hasDetails && place.details.openingHours && (
        <div className="opening-hours">
          <p className="section-title">영업시간</p>
          <ul>
            {place.details.openingHours.weekdayText.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="button-container">
        <button 
          className="add-button"
          onClick={() => onAdd(place)}
        >
          ➕ 일정에 추가
        </button>
      </div>
    </div>
  );
}

export default MapPlaceInfoCard;