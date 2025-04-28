import React, { useState, useEffect } from 'react';
import './WeatherWorld.css';

// React Icons import
import { IoIosSunny, IoIosPartlySunny, IoIosCloudy, IoIosRainy, IoIosThunderstorm, IoIosSnow } from 'react-icons/io';
import { BsCloudFog } from 'react-icons/bs';
import { IoCalendarOutline, IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

// Constants
const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY || '';
const CURRENT_WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API = 'https://api.openweathermap.org/data/2.5/forecast';

// 참고: API 키가 없는 경우를 위한 데모 데이터
const DEMO_WEATHER_DATA = {
  "weather": [{"id": 800, "main": "Clear", "description": "맑음", "icon": "01d"}],
  "main": {"temp": 14, "feels_like": 12, "humidity": 45, "pressure": 1016},
  "wind": {"speed": 2.1, "deg": 270}
};

// 참고: 예보 데모 데이터
const DEMO_FORECAST_DATA = {
  "list": [
    {
      "dt": Date.now() / 1000 + 86400, // 내일
      "main": {"temp": 15, "feels_like": 14, "temp_min": 13, "temp_max": 17},
      "weather": [{"id": 800, "main": "Clear", "description": "맑음", "icon": "01d"}]
    },
    {
      "dt": Date.now() / 1000 + 86400 * 2, // 모레
      "main": {"temp": 18, "feels_like": 17, "temp_min": 16, "temp_max": 20},
      "weather": [{"id": 801, "main": "Clouds", "description": "구름 조금", "icon": "02d"}]
    },
    {
      "dt": Date.now() / 1000 + 86400 * 3, // 3일 후
      "main": {"temp": 16, "feels_like": 15, "temp_min": 14, "temp_max": 18},
      "weather": [{"id": 500, "main": "Rain", "description": "비", "icon": "10d"}]
    },
    {
      "dt": Date.now() / 1000 + 86400 * 4, // 4일 후
      "main": {"temp": 14, "feels_like": 13, "temp_min": 12, "temp_max": 16},
      "weather": [{"id": 802, "main": "Clouds", "description": "구름 많음", "icon": "03d"}]
    },
    {
      "dt": Date.now() / 1000 + 86400 * 5, // 5일 후
      "main": {"temp": 12, "feels_like": 11, "temp_min": 10, "temp_max": 14},
      "weather": [{"id": 600, "main": "Snow", "description": "눈", "icon": "13d"}]
    }
  ]
};

// Countries data
const countries = [
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

// 날씨 아이콘 매핑 함수
const getWeatherIcon = (weatherCode, iconSize = 70) => {
  // OWM 날씨 코드에 따른 아이콘 반환
  // https://openweathermap.org/weather-conditions
  if (weatherCode >= 200 && weatherCode < 300) {
    return <IoIosThunderstorm size={iconSize} color="#6B7280" />; // 뇌우
  } else if (weatherCode >= 300 && weatherCode < 400) {
    return <IoIosRainy size={iconSize} color="#6B7280" />; // 이슬비
  } else if (weatherCode >= 500 && weatherCode < 600) {
    return <IoIosRainy size={iconSize} color="#6B7280" />; // 비
  } else if (weatherCode >= 600 && weatherCode < 700) {
    return <IoIosSnow size={iconSize} color="#6B7280" />; // 눈
  } else if (weatherCode >= 700 && weatherCode < 800) {
    return <BsCloudFog size={iconSize} color="#6B7280" />; // 안개
  } else if (weatherCode === 800) {
    return <IoIosSunny size={iconSize} color="#F59E0B" />; // 맑음
  } else if (weatherCode === 801) {
    return <IoIosPartlySunny size={iconSize} color="#6B7280" />; // 구름 조금
  } else if (weatherCode >= 802 && weatherCode < 900) {
    return <IoIosCloudy size={iconSize} color="#6B7280" />; // 구름 많음
  } else {
    return <IoIosSunny size={iconSize} color="#F59E0B" />; // 기본값
  }
};

// 날씨 아이콘 코드에 따른 한글 설명
const getWeatherDescription = (iconCode) => {
  const descriptions = {
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
  
  return descriptions[iconCode] || '날씨 정보 없음';
};

// 타임스탬프를 날짜 문자열로 변환
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  
  return `${month}/${day} (${dayOfWeek})`;
};

// 예보 데이터를 날짜별로 그룹화
const groupForecastByDay = (forecastData) => {
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
  
  // 각 날짜별 데이터 처리
  Object.keys(groupedData).forEach(key => {
    const day = groupedData[key];
    
    // 최고, 최저 온도 계산
    day.maxTemp = Math.max(...day.temps);
    day.minTemp = Math.min(...day.temps);
    
    // 가장 빈번한 날씨 코드 찾기
    const codeCount = {};
    day.weatherCodes.forEach(code => {
      codeCount[code] = (codeCount[code] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostFrequentCode = day.weatherCodes[0];
    
    Object.keys(codeCount).forEach(code => {
      if (codeCount[code] > maxCount) {
        maxCount = codeCount[code];
        mostFrequentCode = parseInt(code);
      }
    });
    
    day.mainWeatherCode = mostFrequentCode;
  });
  
  return Object.values(groupedData).slice(0, 5); // 최대 5일 데이터
};

// 데모 예보 데이터 생성
const generateDemoForecastData = () => {
  const weatherCodes = [800, 801, 802, 803, 500, 501, 600, 700];
  const weatherIcons = ['01d', '02d', '03d', '04d', '10d', '13d', '50d'];
  const result = {
    list: []
  };
  
  // 현재 시각부터 5일치 데이터 생성
  const now = Math.floor(Date.now() / 1000);
  
  // 각 날짜별로 8개의 3시간 간격 데이터 생성 (3시간 * 8 = 24시간)
  for (let day = 1; day <= 5; day++) {
    for (let hour = 0; hour < 8; hour++) {
      const randomTemp = Math.round(10 + Math.random() * 20); // 10-30도
      const randomWeatherCode = weatherCodes[Math.floor(Math.random() * weatherCodes.length)];
      const randomIcon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
      
      result.list.push({
        dt: now + (day * 86400) - (hour * 3600 * 3), // 각 날짜의 다양한 시간대
        main: {
          temp: randomTemp,
          feels_like: randomTemp - 2,
          temp_min: randomTemp - 2,
          temp_max: randomTemp + 2,
          humidity: Math.round(40 + Math.random() * 40) // 40-80%
        },
        weather: [{
          id: randomWeatherCode,
          main: randomWeatherCode === 800 ? 'Clear' : 'Clouds',
          description: getWeatherDescription(randomIcon),
          icon: randomIcon
        }]
      });
    }
  }
  
  return result;
};

const WeatherWorld = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useDemo, setUseDemo] = useState(!API_KEY || API_KEY.trim() === '');
  const [expandedCards, setExpandedCards] = useState({});

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addCountry = async () => {
    if (!selectedCountry) return;

    // 이미 추가된 국가인지 확인
    if (weatherData.some(item => item.countryCode === selectedCountry)) {
      return;
    }

    const country = countries.find(c => c.code === selectedCountry);
    if (!country) return;

    setIsLoading(true);

    // 데모 모드인 경우
    if (useDemo) {
      setTimeout(() => {
        // 데모 데이터 약간 변형
        const demoData = JSON.parse(JSON.stringify(DEMO_WEATHER_DATA));
        demoData.main.temp = Math.round(5 + Math.random() * 25); // 5-30도 사이
        
        // 날씨 코드 랜덤 선택
        const weatherCodes = [800, 801, 802, 500, 600, 200, 300]; // 다양한 날씨 코드
        demoData.weather[0].id = weatherCodes[Math.floor(Math.random() * weatherCodes.length)];
        
        // 날씨 아이콘과 설명 매핑
        const iconCodes = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
        const randomIcon = iconCodes[Math.floor(Math.random() * iconCodes.length)];
        demoData.weather[0].icon = randomIcon;
        demoData.weather[0].description = getWeatherDescription(randomIcon);
        
        // 예보 데이터 생성
        const demoForecastData = generateDemoForecastData();
        
        setWeatherData(prev => [...prev, {
          id: Date.now(),
          countryCode: country.code,
          countryName: country.name,
          flag: country.flag,
          capital: country.capital,
          weatherData: demoData,
          forecastData: groupForecastByDay(demoForecastData)
        }]);
        
        setSelectedCountry('');
        setIsLoading(false);
      }, 300);
      
      return;
    }

    // 실제 API 사용
    try {
      // 현재 날씨 데이터 가져오기
      const currentResponse = await fetch(
        `${CURRENT_WEATHER_API}?q=${country.capital},${country.code}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error(`현재 날씨 데이터를 가져오는데 실패했습니다`);
      }

      const currentData = await currentResponse.json();
      
      // 예보 데이터 가져오기
      const forecastResponse = await fetch(
        `${FORECAST_API}?q=${country.capital},${country.code}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`예보 데이터를 가져오는데 실패했습니다`);
      }
      
      const forecastData = await forecastResponse.json();
      const groupedForecastData = groupForecastByDay(forecastData);
      
      setWeatherData(prev => [...prev, {
        id: Date.now(),
        countryCode: country.code,
        countryName: country.name,
        flag: country.flag,
        capital: country.capital,
        weatherData: currentData,
        forecastData: groupedForecastData
      }]);

      setSelectedCountry('');
    } catch (err) {
      console.error('API 오류:', err);
      
      // API 오류 발생 시 자동으로 데모 모드로 전환
      if (!useDemo) {
        setUseDemo(true);
        console.log("API 오류로 인해 데모 모드로 전환합니다.");
        
        // 데모 데이터로 추가
        const demoData = JSON.parse(JSON.stringify(DEMO_WEATHER_DATA));
        const demoForecastData = generateDemoForecastData();
        
        setWeatherData(prev => [...prev, {
          id: Date.now(),
          countryCode: country.code,
          countryName: country.name,
          flag: country.flag,
          capital: country.capital,
          weatherData: demoData,
          forecastData: groupForecastByDay(demoForecastData)
        }]);
        
        setSelectedCountry('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeCountry = (id) => {
    setWeatherData(prev => prev.filter(item => item.id !== id));
    // 확장 상태도 제거
    setExpandedCards(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // 날씨 예보 컴포넌트
  const ForecastSection = ({ forecastData }) => {
    return (
      <div className="forecast-section">
        <div className="forecast-title">
          <IoCalendarOutline size={18} />
          <span>5일 예보</span>
        </div>
        <div className="forecast-items">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-day">
              <div className="forecast-date">{formatDate(day.date)}</div>
              <div className="forecast-icon">
                {getWeatherIcon(day.mainWeatherCode, 30)}
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
  };

  // 간결한 날씨 카드 컴포넌트
  const WeatherCard = ({ data, onRemove, isExpanded, onToggle }) => {
    const { id, countryCode, countryName, capital, flag, weatherData, forecastData } = data;
    const weather = weatherData.weather[0];
    const main = weatherData.main;

    return (
      <div className="weather-card">
        <div className="card-country">
          <span className="flag">{flag}</span>
          <h3>{countryName}</h3>
          <button 
            onClick={() => onRemove(id)}
            className="remove-btn"
          >×</button>
        </div>
        <div className="card-city">{capital}</div>
        
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(weather.id)}
          </div>
          <div className="temp">{Math.round(main.temp)}°C</div>
          <div className="sky">{weather.description}</div>
        </div>
        
        {forecastData && (
          <div className="forecast-toggle">
            <button 
              className="toggle-button"
              onClick={() => onToggle(id)}
            >
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
            {countries.map(country => (
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
      </div>

      <div className="weather-cards-container">
        {weatherData.length === 0 ? (
          <div className="no-country">
            국가를 선택하여 날씨 정보를 확인하세요
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