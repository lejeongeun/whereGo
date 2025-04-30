import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import MapPlaceInfoCard from './MapPlaceInfoCard';
import PlaceTypeFilter from './PlaceTypeFilter';
import ScheduleList from '../schedule/ScheduleList';
import api from '../../api';
import travelAdvisorAPI from '../../api/travelAdvisorAPI';
import './MapContainer.css';

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
  const [markers, setMarkers] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [schedulePlaces, setSchedulePlaces] = useState([]);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placeType, setPlaceType] = useState('restaurants');

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    if (mapInstance) {
      searchNearbyPlaces({
        bl_latitude: (center.lat - 0.01).toString(),
        tr_latitude: (center.lat + 0.01).toString(),
        bl_longitude: (center.lng - 0.01).toString(),
        tr_longitude: (center.lng + 0.01).toString()
      });
    }
  }, []);
  
  const onMapUnmount = useCallback(() => setMap(null), []);
  const onAutocompleteLoad = (autocompleteInstance) => setAutocomplete(autocompleteInstance);

  // 자동완성으로 장소 선택 시
  const handlePlaceChanged = async () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        setSelectedPlace({
          name: place.name,
          address: place.formatted_address,
          latitude: location.lat,
          longitude: location.lng,
          description: place.formatted_address,
          rating: place.rating,
          details: place.formatted_phone_number ? {
            formattedPhoneNumber: place.formatted_phone_number,
            website: place.website,
            openingHours: place.opening_hours
          } : undefined
        });
        
        map.panTo(location);
        
        searchNearbyPlaces({
          bl_latitude: (location.lat - 0.01).toString(),
          tr_latitude: (location.lat + 0.01).toString(),
          bl_longitude: (location.lng - 0.01).toString(),
          tr_longitude: (location.lng + 0.01).toString()
        });
      }
    }
  };

  // Trip Advisor API로 선택한 유형의 장소 검색
  const searchNearbyPlaces = async (bounds) => {
    setLoading(true);
    try {
      let results = [];
      
      switch (placeType) {
        case 'restaurants':
          results = await travelAdvisorAPI.getRestaurants(bounds);
          break;
        case 'hotels':
          results = await travelAdvisorAPI.getHotels(bounds);
          break;
        case 'attractions':
          results = await travelAdvisorAPI.getAttractions(bounds);
          break;
        default:
          results = await travelAdvisorAPI.getRestaurants(bounds);
      }
      
      const newMarkers = results
        .filter(place => place.latitude && place.longitude)
        .map(place => ({
          id: place.id,
          position: {
            lat: place.latitude,
            lng: place.longitude
          },
          place: place
        }));
      
      setMarkers(newMarkers);
      
      if (results.length > 0 && !selectedPlace) {
        setSelectedPlace(results[0]);
      }
    } catch (error) {
      console.error('장소 검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 장소 유형 변경 시 새로운 검색 실행
  useEffect(() => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        searchNearbyPlaces({
          bl_latitude: sw.lat().toString(),
          tr_latitude: ne.lat().toString(),
          bl_longitude: sw.lng().toString(),
          tr_longitude: ne.lng().toString()
        });
      }
    }
  }, [placeType, map]);

  // 마커 클릭 시 장소 정보 표시
  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  // 일정에 장소 추가
  const handleAddToSchedule = async (place) => {
    try {
      const newPlace = {
        id: Date.now().toString(),
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        description: place.description,
        photo: place.photo,
        rating: place.rating,
        type: placeType
      };
      
      setSchedulePlaces((prev) => [...prev, newPlace]);
    } catch (error) {
      console.error('일정 추가 오류:', error);
    }
  };

  // 일정에서 장소 삭제
  const handleDeleteFromSchedule = (id) => {
    setSchedulePlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return isLoaded ? (
    <div className="map-container-wrapper">
      <div className="search-controls">
        <PlaceTypeFilter
          selectedType={placeType}
          onTypeChange={setPlaceType}
        />
        
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={handlePlaceChanged}
          className="search-autocomplete"
        >
          <input
            type="text"
            placeholder="장소를 검색하세요"
            className="search-input"
          />
        </Autocomplete>
      </div>

      {loading && (
        <div className="loading-indicator">
          <span className="loading-text">장소 정보를 불러오는 중...</span>
        </div>
      )}

      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
        >
          {markers.map(marker => (
            <Marker 
              key={marker.id}
              position={marker.position}
              onClick={() => handleMarkerClick(marker.place)}
              icon={selectedPlace && selectedPlace.id === marker.place.id ? 
                {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(38, 38)
                } : undefined
              }
            />
          ))}
        </GoogleMap>
      </div>
      
      <div className="place-info-wrapper">
        {selectedPlace && (
          <MapPlaceInfoCard 
            place={selectedPlace} 
            onAdd={handleAddToSchedule} 
          />
        )}
      </div>
      
      <div className="schedule-wrapper">
        <h3>내 여행 일정</h3>
        <ScheduleList places={schedulePlaces} onDelete={handleDeleteFromSchedule} />
      </div>
    </div>
  ) : (
    <div className="loading-map">지도를 불러오는 중...</div>
  );
};

export default MapContainer;