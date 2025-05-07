import React from 'react';
import TripScheduleMap from './TripScheduleMap';
import TripScheduleLogin from './TripScheduleLogin';
import TripScheduleSurvey from './TripScheduleSurvey';
import './schedule.css';
import { addPlaceToSchedule, getPlacesByScheduleAndDay, createSchedule } from '../../api/scheduleApi';

function TripScheduleContainer() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedPlace, setSelectedPlace] = React.useState(null);
  const [isLoginFormOpen, setIsLoginFormOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));
  const [surveyStep, setSurveyStep] = React.useState(1);
  const [surveyAnswers, setSurveyAnswers] = React.useState({});
  const [scheduleId, setScheduleId] = React.useState(null);
  const [selectedDay, setSelectedDay] = React.useState(1);
  const [dayPlaces, setDayPlaces] = React.useState([]);

  React.useEffect(() => {
    const handleStorage = () => {
      const newLoginState = !!localStorage.getItem('token');
      setIsLoggedIn(newLoginState);
      
      if (!newLoginState) {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.email;
        if (userId) {
          localStorage.removeItem(`currentSchedule_${userId}`);
        }
        setSurveyStep(1);
        setSurveyAnswers({});
        setScheduleId(null);
        setSelectedDay(1);
        setDayPlaces([]);
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.email;
      if (userId) {
        localStorage.removeItem(`currentSchedule_${userId}`);
      }
      setSurveyStep(1);
      setSurveyAnswers({});
      setScheduleId(null);
      setSelectedDay(1);
      setDayPlaces([]);
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.email;
    if (userId) {
      const savedSchedule = localStorage.getItem(`currentSchedule_${userId}`);
      if (savedSchedule) {
        setSurveyStep(5);
        const parsed = JSON.parse(savedSchedule);
        setSurveyAnswers(parsed);
        if (parsed.id) setScheduleId(parsed.id);
      }
    }
  }, []);

  React.useEffect(() => {
    if (scheduleId && selectedDay) {
      fetchDayPlaces(selectedDay);
    }
    // eslint-disable-next-line
  }, [scheduleId, selectedDay]);

  React.useEffect(() => {
    // console.log('Selected day changed:', selectedDay);
  }, [selectedDay]);

  const fetchDayPlaces = async (dayNumber) => {
    if (!scheduleId) return;
    try {
      const places = await getPlacesByScheduleAndDay(scheduleId, dayNumber);
      setDayPlaces(places);
    } catch (e) {
      setDayPlaces([]);
    }
  };

  const handleAddToSchedule = async (place) => {
    // console.log('Adding place to schedule:', {
    //   place,
    //   scheduleId,
    //   selectedDay
    // });

    if (!scheduleId) {
      alert('일정이 먼저 생성되어야 합니다.');
      return;
    }

    if (!selectedDay) {
      alert('날짜를 선택해주세요.');
      return;
    }

    try {
      const result = await addPlaceToSchedule({
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        imageUrl: place.imageUrl,
        scheduleId,
        dayNumber: selectedDay,
      });

      // console.log('Place added successfully:', result);
      setDayPlaces(prevPlaces => [...prevPlaces, result]);
    } catch (error) {
      console.error('Error adding place:', error);
      alert('장소 추가에 실패했습니다.');
    }
  };

  const handleCreateSchedule = async (scheduleData) => {
    const result = await createSchedule(scheduleData);
    setScheduleId(result.id);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.email;
    if (userId) {
      const updated = { ...scheduleData, id: result.id };
      localStorage.setItem(`currentSchedule_${userId}`, JSON.stringify(updated));
      setSurveyAnswers(updated);
    }
  };

  return (
    <div className="trip-schedule-container">
      <div className="left-panel">
        <TripScheduleMap 
          setSelectedPlace={setSelectedPlace}
          selectedPlace={selectedPlace}
          onAddToSchedule={handleAddToSchedule}
        />
      </div>
      <div className="right-panel">
        {isLoggedIn ? (
          <TripScheduleSurvey
            surveyStep={surveyStep}
            setSurveyStep={setSurveyStep}
            surveyAnswers={surveyAnswers}
            setSurveyAnswers={setSurveyAnswers}
            scheduleId={scheduleId}
            setScheduleId={setScheduleId}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            dayPlaces={dayPlaces}
            setDayPlaces={setDayPlaces}
            fetchDayPlaces={fetchDayPlaces}
            onCreateSchedule={handleCreateSchedule}
          />
        ) : (
          <TripScheduleLogin
            isLoginFormOpen={isLoginFormOpen}
            setIsLoginFormOpen={setIsLoginFormOpen}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </div>
    </div>
  );
}

export default TripScheduleContainer; 