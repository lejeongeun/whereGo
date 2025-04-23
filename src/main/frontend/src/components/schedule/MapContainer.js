import React, { useEffect } from 'react';
import './MapPlaceInfoCard.css';

const MapContainer = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&libraries=services`;
    script.async = true;
    script.onload = () => {
      const kakao = window.kakao;

      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(35.1796, 136.9066), // 나고야 중심 좌표
        level: 4,
      };

      const map = new kakao.maps.Map(container, options);
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default MapContainer;