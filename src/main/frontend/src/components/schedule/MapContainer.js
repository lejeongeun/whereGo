// 📁 src/components/map/MapContainer.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import MapPlaceInfoCard from './MapPlaceInfoCard';
import ScheduleList from '../schedule/ScheduleList';
import api from '../../api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.5665, // 서울 중심 좌표
  lng: 126.9780,
};

const libraries = ['places'];

const MapContainer = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [schedulePlaces, setSchedulePlaces] = useState([]);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);

  const onMapLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onMapUnmount = useCallback(() => setMap(null), []);
  const onAutocompleteLoad = (autocompleteInstance) => setAutocomplete(autocompleteInstance);

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarker(location);
        setSelectedPlace({
          name: place.name,
          address: place.formatted_address,
          latitude: location.lat,
          longitude: location.lng,
          description: place.formatted_address,
        });
        map.panTo(location);
      }
    }
  };

  const handleAddToSchedule = async (place) => {
    try {
      const response = await api.post('/api/places', {
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        description: place.description,
        scheduleId: currentScheduleId,
      });
      setSchedulePlaces((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('일정 추가 오류:', error);
    }
  };

  const handleDeleteFromSchedule = (id) => {
    setSchedulePlaces((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    const fetchSchedulePlaces = async () => {
      try {
        const response = await api.get(`/api/places/schedule/${currentScheduleId}`);
        setSchedulePlaces(response.data);
      } catch (error) {
        console.error('일정 목록 조회 오류:', error);
      }
    };

    if (currentScheduleId) {
      fetchSchedulePlaces();
    }
  }, [currentScheduleId]);

  return isLoaded ? (
      <div>
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
          <input
              type="text"
              placeholder="장소를 검색하세요"
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </Autocomplete>

        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>

        <MapPlaceInfoCard place={selectedPlace} onAdd={handleAddToSchedule} />
        <ScheduleList places={schedulePlaces} onDelete={handleDeleteFromSchedule} />
      </div>
  ) : (
      <div>지도를 불러오는 중...</div>
  );
};

export default MapContainer;
