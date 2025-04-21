import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import api from '../api'; // ✅ api 인스턴스 사용
import { useNavigate } from 'react-router-dom';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 37.5665, // 서울 좌표
    lng: 126.9780,
};

const libraries = ['places'];

function MapComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const navigate = useNavigate();

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onAutocompleteLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = async () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setMarker(location);
                setPlaceDetails(place);

                // ✅ 서버로 장소 정보 저장 (인증 확인 후)
                try {
                    // 인증 상태 확인
                    await api.get('/user/info');
                    const response = await api.post('/places', {
                        name: place.name,
                        latitude: location.lat,
                        longitude: location.lng,
                        address: place.formatted_address,
                    });
                    console.log('Place saved:', response.data);
                } catch (error) {
                    console.error('Error saving place:', error.response?.data || error.message);
                    navigate('/login'); // 인증 실패 시 로그인 페이지로 리디렉션
                }

                // 지도 중심을 선택한 장소로 이동
                map.panTo(location);
            }
        }
    };

    return isLoaded ? (
        <div>
            <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="장소를 검색하세요"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                    }}
                />
            </Autocomplete>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </div>
    ) : (
        <div>Loading...</div>
    );
}

export default MapComponent;