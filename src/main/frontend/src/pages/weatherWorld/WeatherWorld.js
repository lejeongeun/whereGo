import React, { useState } from 'react';
import './WeatherWorld.css';
import { IoIosSunny, IoIosPartlySunny, IoIosCloudy, IoIosRainy, IoIosThunderstorm, IoIosSnow } from 'react-icons/io';
import { BsCloudFog } from 'react-icons/bs';
import { IoCalendarOutline, IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY || '';
const CURRENT_WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API = 'https://api.openweathermap.org/data/2.5/forecast';

const WEATHER_ICONS = {
  200: { component: IoIosThunderstorm, color: "#6B7280" }, // 뇌우
  300: { component: IoIosRainy, color: "#6B7280" },        // 이슬비
  500: { component: IoIosRainy, color: "#6B7280" },        // 비
  600: { component: IoIosSnow, color: "#6B7280" },         // 눈
  700: { component: BsCloudFog, color: "#6B7280" },        // 안개
  800: { component: IoIosSunny, color: "#F59E0B" },        // 맑음
  801: { component: IoIosPartlySunny, color: "#6B7280" },  // 구름 조금
  802: { component: IoIosCloudy, color: "#6B7280" }        // 구름 많음
};

const WEATHER_DESCRIPTIONS = {
  '01d': '맑음', '01n': '맑음', 
  '02d': '구름 조금', '02n': '구름 조금', 
  '03d': '구름 많음', '03n': '구름 많음', 
  '04d': '흐림', '04n': '흐림', 
  '09d': '소나기', '09n': '소나기', 
  '10d': '비', '10n': '비', 
  '11d': '뇌우', '11n': '뇌우', 
  '13d': '눈', '13n': '눈',
  '50d': '안개', '50n': '안개'
};

const COUNTRIES = [
  { code: 'kr', name: '대한민국', capital: 'Seoul', flag: '🇰🇷' },
  { code: 'us', name: '미국', capital: 'Washington D.C.', flag: '🇺🇸' },
  { code: 'jp', name: '일본', capital: 'Tokyo', flag: '🇯🇵' },
  { code: 'cn', name: '중국', capital: 'Beijing', flag: '🇨🇳' },
  { code: 'gb', name: '영국', capital: 'London', flag: '🇬🇧' },
  { code: 'fr', name: '프랑스', capital: 'Paris', flag: '🇫🇷' },
  { code: 'de', name: '독일', capital: 'Berlin', flag: '🇩🇪' },
  { code: 'it', name: '이탈리아', capital: 'Rome', flag: '🇮🇹' },
  { code: 'es', name: '스페인', capital: 'Madrid', flag: '🇪🇸' },
  { code: 'ca', name: '캐나다', capital: 'Ottawa', flag: '🇨🇦' }
];

const utils = {
  // 날씨 아이콘 매핑 함수
  getWeatherIcon: (weatherCode, iconSize = 70) => {
    // Find nearest lower key
    const iconKey = Object.keys(WEATHER_ICONS)
      .map(Number)
      .filter(code => code <= weatherCode)
      .sort((a, b) => b - a)[0] || 800;

    const { component: IconComponent, color } = WEATHER_ICONS[iconKey];
    return <IconComponent size={iconSize} color={color} />;
  },

  // 날씨 설명 가져오기
  getWeatherDescription: (iconCode) => WEATHER_DESCRIPTIONS[iconCode] || '날씨 정보 없음',

  // 타임스탬프를 날짜 문자열로 변환
  formatDate: (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`;
  },

  // 예보 데이터를 날짜별로 그룹화
  groupForecastByDay: (forecastData) => {
    const groupedData = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: item.dt,
          temps: [],
          weatherCodes: []
        };
      }
      
      groupedData[dateKey].temps.push(item.main.temp);
      groupedData[dateKey].weatherCodes.push(item.weather[0].id);
    });
    
    return Object.values(groupedData)
      .map(day => ({
        ...day,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps),
        mainWeatherCode: utils.getMostFrequentCode(day.weatherCodes)
      }))
      .slice(0, 5); // 최대 5일 데이터
  },
  
  // 가장 빈번한 날씨 코드 찾기
  getMostFrequentCode: (codes) => {
    const codeCount = {};
    codes.forEach(code => codeCount[code] = (codeCount[code] || 0) + 1);
    
    return Object.entries(codeCount)
      .sort((a, b) => b[1] - a[1])[0][0];
  }
};

const ForecastSection = ({ forecastData }) => (
  <div className="forecast-section">
    <div className="forecast-title">
      <IoCalendarOutline size={18} />
      <span>5일 예보</span>
    </div>
    <div className="forecast-items">
      {forecastData.map((day, index) => (
        <div key={index} className="forecast-day">
          <div className="forecast-date">{utils.formatDate(day.date)}</div>
          <div className="forecast-icon">
            {utils.getWeatherIcon(day.mainWeatherCode, 30)}
          </div>
          <div className="forecast-temp">
            <span className="max-temp">{Math.round(day.maxTemp)}°</span>
            <span className="min-temp">{Math.round(day.minTemp)}°</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WeatherCard = ({ data, onRemove, isExpanded, onToggle }) => {
  const { id, countryName, capital, flag, weatherData, forecastData } = data;
  const weather = weatherData.weather[0];
  const main = weatherData.main;

  return (
    <div className="weather-card">
      <div className="card-country">
        <span className="flag">{flag}</span>
        <h3>{countryName}</h3>
        <button onClick={() => onRemove(id)} className="remove-btn">×</button>
      </div>
      <div className="card-city">{capital}</div>
      
      <div className="weather-main">
        <div className="weather-icon">
          {utils.getWeatherIcon(weather.id)}
        </div>
        <div className="temp">{Math.round(main.temp)}°C</div>
        <div className="sky">{weather.description}</div>
      </div>
      
      {forecastData && (
        <div className="forecast-toggle">
          <button className="toggle-button" onClick={() => onToggle(id)}>
            {isExpanded ? (
              <>
                <span>예보 숨기기</span>
                <IoChevronUpOutline />
              </>
            ) : (
              <>
                <span>5일 예보 보기</span>
                <IoChevronDownOutline />
              </>
            )}
          </button>
          
          {isExpanded && <ForecastSection forecastData={forecastData} />}
        </div>
      )}
    </div>
  );
};

const WeatherWorld = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [error, setError] = useState(null);

  const handleCountryChange = (e) => setSelectedCountry(e.target.value);

  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const removeCountry = (id) => {
    setWeatherData(prev => prev.filter(item => item.id !== id));
    setExpandedCards(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // 국가 추가 처리
  const addCountry = async () => {
    if (!selectedCountry) return;

    // 이미 추가된 국가인지 확인
    if (weatherData.some(item => item.countryCode === selectedCountry)) {
      setError('이미 추가된 국가입니다.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (!country) return;

    setIsLoading(true);
    setError(null);

    try {
      // 현재 날씨 데이터 가져오기
      const currentResponse = await fetch(
        `${CURRENT_WEATHER_API}?q=${country.capital},${country.code}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error(`날씨 데이터를 가져오는데 실패했습니다. (${currentResponse.status})`);
      }

      const currentData = await currentResponse.json();
      
      // 예보 데이터 가져오기
      const forecastResponse = await fetch(
        `${FORECAST_API}?q=${country.capital},${country.code}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`예보 데이터를 가져오는데 실패했습니다. (${forecastResponse.status})`);
      }
      
      const forecastData = await forecastResponse.json();
      
      setWeatherData(prev => [...prev, {
        id: Date.now(),
        countryCode: country.code,
        countryName: country.name,
        flag: country.flag,
        capital: country.capital,
        weatherData: currentData,
        forecastData: utils.groupForecastByDay(forecastData)
      }]);

      setSelectedCountry('');
    } catch (err) {
      console.error('API 오류:', err);
      setError(err.message || 'API 요청 중 오류가 발생했습니다. API 키를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <div className="blue-header">
        <h2>전 세계 날씨 정보를 한눈에</h2>
        
        <div className="search-bar">
          <select 
            value={selectedCountry}
            onChange={handleCountryChange}
            className="country-dropdown"
          >
            <option value="">국가 선택</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={addCountry}
            disabled={isLoading || !selectedCountry}
            className="add-country-btn"
          >
            {isLoading ? '로딩중...' : '국가 추가'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="weather-cards-container">
        {weatherData.length === 0 ? (
          <div className="country-selection-container">
          <img 
            src="/resources/img/summer_sunny.png" 
            alt="여름 날씨" 
            className="weather-image" 
          />
          <div className="no-country">
            국가를 선택하여 날씨 정보를 확인하세요
          </div>
          <img 
            src="/resources/img/winter_snow.png" 
            alt="겨울 날씨" 
            className="weather-image" 
          />
        </div>
        ) : (
          <div className="weather-cards">
            {weatherData.map(data => (
              <WeatherCard 
                key={data.id}
                data={data}
                onRemove={removeCountry}
                isExpanded={!!expandedCards[data.id]}
                onToggle={toggleCardExpansion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWorld;