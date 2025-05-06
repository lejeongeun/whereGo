import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import MapPlaceInfoCard from './MapPlaceInfoCard';
import PlaceTypeFilter from './PlaceTypeFilter';
import ScheduleList from '../schedule/ScheduleList';
import api from '../../api';
import travelAdvisorAPI from '../../api/travelAdvisorAPI';
import './schedule.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.5665, // 서울 중심 좌표
  lng: 126.9780,
};

const libraries = ['places'];

const MapContainer = ({ setSelectedPlace, selectedPlace }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [schedulePlaces, setSchedulePlaces] = useState([]);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placeType, setPlaceType] = useState('restaurants');

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    if (mapInstance) {
      searchNearbyPlaces({
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
    </div>
  ) : (
    <div className="loading-map">지도를 불러오는 중...</div>
  );
};

export default MapContainer;