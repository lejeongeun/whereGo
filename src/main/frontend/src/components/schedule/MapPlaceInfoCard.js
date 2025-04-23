import React from 'react';
import './MapPlaceInfoCard.css';

function MapPlaceInfoCard({ place, onAdd }) {
  if (!place) return null;

  return (
    <div className="map-place-info-card">
      <img
        src={place.image || 'https://via.placeholder.com/120'}
        alt={place.name}
        className="place-card-image"
      />
      <div className="place-card-content">
        <h4 className="place-card-title">{place.name}</h4>
        <p className="place-card-desc">{place.description}</p>
        <button className="place-card-add-button" onClick={() => onAdd(place)}>
          ➕ 일정에 추가
        </button>
      </div>
    </div>
  );
}

export default MapPlaceInfoCard;
