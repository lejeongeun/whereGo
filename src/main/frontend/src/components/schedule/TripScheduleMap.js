import React from 'react';
import MapContainer from './MapContainer';
import MapPlaceInfoCard from './MapPlaceInfoCard';
import './schedule.css';

function TripScheduleMap({ setSelectedPlace, selectedPlace, onAddToSchedule }) {
  return (
    <div className="map-container">
      <MapContainer 
        setSelectedPlace={setSelectedPlace}
        selectedPlace={selectedPlace}
      />
      {selectedPlace && (
        <MapPlaceInfoCard 
          place={selectedPlace} 
          onAdd={onAddToSchedule} 
        />
      )}
    </div>
  );
}

export default TripScheduleMap; 