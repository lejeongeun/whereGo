import React from 'react';
import MapContainer from './MapContainer';
import MapPlaceInfoCard from './MapPlaceInfoCard';
import './TripScheduleMap.css';

function TripScheduleMap({ setSelectedPlace, selectedPlace, onAddToSchedule }) {
  return (
    <div className="map-container">
      <MapContainer setSelectedPlace={setSelectedPlace} />
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