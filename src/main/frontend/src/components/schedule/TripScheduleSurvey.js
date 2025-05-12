import React from 'react';
import ScheduleSurveyPanel from './ScheduleSurveyPanel';
import ScheduleDatePanel from './ScheduleDatePanel';
import WhoWithPanel from './WhoWithPanel';
import TravelStylePanel from './TravelStylePanel';
import ScheduleResultPanel from './ScheduleResultPanel';
import './schedule.css';

function TripScheduleSurvey({ 
  surveyStep, 
  setSurveyStep, 
  surveyAnswers, 
  setSurveyAnswers, 
  onCreateSchedule,
  selectedDay,
  setSelectedDay,
  dayPlaces,
  setDayPlaces,
  fetchDayPlaces,
  scheduleId
}) {
  const handleGoBack = (currentStep) => {
    const updatedAnswers = { ...surveyAnswers };
    switch (currentStep) {
      case 2:
        delete updatedAnswers.city;
        break;
      case 3:
        delete updatedAnswers.startDate;
        delete updatedAnswers.endDate;
        break;
      case 4:
        delete updatedAnswers.whoWith;
        break;
      default:
        break;
    }
    setSurveyAnswers(updatedAnswers);
    setSurveyStep(currentStep - 1);
  };

  const handleScheduleReset = () => {
    setSurveyAnswers({});
    setSurveyStep(1);
  };

  const renderSurveyStep = () => {
    switch (surveyStep) {
      case 1:
        return (
          <ScheduleSurveyPanel
            step={surveyStep}
            totalSteps={4}
            answer={surveyAnswers.city}
            onSelect={(city) => setSurveyAnswers((prev) => ({ ...prev, city }))}
            onNext={() => setSurveyStep(2)}
          />
        );
      case 2:
        return (
          <ScheduleDatePanel
            step={surveyStep}
            totalSteps={4}
            startDate={surveyAnswers.startDate}
            endDate={surveyAnswers.endDate}
            onDateChange={({ startDate, endDate }) => setSurveyAnswers((prev) => ({ ...prev, startDate, endDate }))}
            onNext={() => setSurveyStep(3)}
            onReset={() => setSurveyAnswers((prev) => ({ ...prev, startDate: null, endDate: null }))}
            onGoBack={() => handleGoBack(2)}
          />
        );
      case 3:
        return (
          <WhoWithPanel
            step={surveyStep}
            totalSteps={4}
            answer={surveyAnswers.whoWith}
            onSelect={(whoWith) => setSurveyAnswers((prev) => ({ ...prev, whoWith }))}
            onNext={() => setSurveyStep(4)}
            onGoBack={() => handleGoBack(3)}
          />
        );
      case 4:
        return (
          <TravelStylePanel
            step={surveyStep}
            totalSteps={4}
            answer={surveyAnswers.style || []}
            onSelect={(style) => setSurveyAnswers((prev) => ({ ...prev, style }))}
            onNext={() => setSurveyStep(5)}
            onGoBack={() => handleGoBack(4)}
            surveyAnswers={surveyAnswers}
            onCreateSchedule={onCreateSchedule}
          />
        );
      case 5:
        return (
          <ScheduleResultPanel
            surveyAnswers={surveyAnswers}
            onReset={handleScheduleReset}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            dayPlaces={dayPlaces}
            setDayPlaces={setDayPlaces}
            fetchDayPlaces={fetchDayPlaces}
            scheduleId={scheduleId}
          />
        );
      default:
        return null;
    }
  };

  return <div className="survey-container">{renderSurveyStep()}</div>;
}

export default TripScheduleSurvey; 