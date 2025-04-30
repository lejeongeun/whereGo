import React, { useState, useEffect } from 'react';
// import ScheduleSearchBar from '../../components/schedule/ScheduleSearchBar';
import MapContainer from '../../components/schedule/MapContainer';
import SearchResultCard from '../../components/schedule/SearchResultCard';
import ScheduleList from '../../components/schedule/ScheduleList';
import MapPlaceInfoCard from '../../components/schedule/MapPlaceInfoCard';
import Login from '../../components/auth/Login';
import ScheduleSurveyPanel from '../../components/schedule/ScheduleSurveyPanel';
import './TripSchedulePage.css';

function TripSchedulePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyAnswers, setSurveyAnswers] = useState({});

  useEffect(() => {
    // 로그인 상태가 바뀔 때마다 체크
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSearch = (keyword) => {
    // 검색 로직은 추후 구현
  };

  const handleAddToSchedule = (place) => {
    if (!schedule.find((item) => item.id === place.id)) {
      setSchedule([...schedule, place]);
    }
  };

  const handleDeleteFromSchedule = (id) => {
    // 일정 리스트에서 해당 id를 가진 장소만 제거
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  return (
    <div className="trip-schedule-container">
      <div className="left-panel">
        {/* <ScheduleSearchBar onSearch={handleSearch} /> */}
        <MapContainer setSelectedPlace={setSelectedPlace} />
        {/* {selectedPlace && (
          <MapPlaceInfoCard place={selectedPlace} onAdd={handleAddToSchedule} />
        )} */}  
      </div>

      <div className="right-panel">
        {isLoggedIn ? (
          surveyStep === 1 || surveyStep === 2 ? (
            <ScheduleSurveyPanel
              step={surveyStep}
              totalSteps={5}
              answer={surveyAnswers.city}
              onSelect={(city) => setSurveyAnswers((prev) => ({ ...prev, city }))}
              onNext={() => setSurveyStep(surveyStep + 1)}
              dateRange={{
                startDate: surveyAnswers.startDate,
                endDate: surveyAnswers.endDate
              }}
              onDateChange={({ startDate, endDate }) => setSurveyAnswers((prev) => ({ ...prev, startDate, endDate }))}
              onDateReset={() => setSurveyAnswers((prev) => ({ ...prev, startDate: null, endDate: null }))}
            />
          ) : (
            <ScheduleList places={schedule} onDelete={handleDeleteFromSchedule} />
          )
        ) : (
          isLoginFormOpen ? (
            <Login onLoginSuccess={() => {
              setIsLoggedIn(true);
              setIsLoginFormOpen(false);
            }} />
          ) : (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
              <div style={{fontSize:'1.3rem',marginBottom:'2rem'}}>로그인을 해주세요</div>
              <button style={{background:'#4f8cff',color:'#fff',border:'none',borderRadius:'12px',padding:'1rem 2.5rem',fontSize:'1.2rem',cursor:'pointer'}} onClick={()=>setIsLoginFormOpen(true)}>
                로그인
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TripSchedulePage;
