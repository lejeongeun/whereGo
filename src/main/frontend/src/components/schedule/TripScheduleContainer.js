import React from 'react';
import TripScheduleMap from './TripScheduleMap';
import TripScheduleLogin from './TripScheduleLogin';
import TripScheduleSurvey from './TripScheduleSurvey';
import './TripScheduleContainer.css';

function TripScheduleContainer() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedPlace, setSelectedPlace] = React.useState({});
  const [schedule, setSchedule] = React.useState([]);
  const [isLoginFormOpen, setIsLoginFormOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));
  const [surveyStep, setSurveyStep] = React.useState(1);
  const [surveyAnswers, setSurveyAnswers] = React.useState({});

  React.useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  React.useEffect(() => {
    const savedSchedule = localStorage.getItem('currentSchedule');
    if (savedSchedule) {
      setSurveyStep(5);
      setSurveyAnswers(JSON.parse(savedSchedule));
    }
  }, []);

  const handleAddToSchedule = (place) => {
    if (!schedule.find((item) => item.id === place.id)) {
      setSchedule([...schedule, place]);
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