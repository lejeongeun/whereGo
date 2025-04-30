import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import './ScheduleDatePanel.css'; // 추후 커스텀 스타일 적용

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
  return start && end && date > start && date < end;
}

function ScheduleDatePanel({ step, totalSteps, startDate, endDate, onDateChange, onNext, onReset }) {
  const [hoverDate, setHoverDate] = useState(null);
  const today = new Date();

  // 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      // 가는 날 선택 or 모두 해제 후 재선택
      onDateChange({ startDate: date, endDate: null });
    } else if (startDate && !endDate) {
      if (date > startDate) {
        // 오는 날 선택
        onDateChange({ startDate, endDate: date });
      } else if (isSameDay(date, startDate)) {
        // 가는 날 다시 클릭: 해제
        onDateChange({ startDate: null, endDate: null });
      }
    }
  };

  // 날짜 tile에 className 부여
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    if (date < today.setHours(0,0,0,0)) return 'calendar-day-disabled';
    if (isSameDay(date, startDate)) return 'calendar-day-start';
    if (isSameDay(date, endDate)) return 'calendar-day-end';
    if (isBetween(date, startDate, endDate)) return 'calendar-day-between';
    if (isSameDay(date, new Date())) return 'calendar-day-today';
    return '';
  };

  // tileContent로 라벨/배지 표시
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    if (isSameDay(date, new Date())) {
      return <div className="calendar-badge-today">오늘</div>;
    }
    if (isSameDay(date, startDate)) {
      return <div className="calendar-label calendar-label-start">가는 날 <span style={{fontSize:'1.1em'}}>→</span></div>;
    }
    if (isSameDay(date, endDate)) {
      return <div className="calendar-label calendar-label-end"><span style={{fontSize:'1.1em'}}>←</span> 오는 날</div>;
    }
    return null;
  };

  // 다음 버튼 활성화 조건
  const canNext = !!(startDate && endDate);

  return (
    <div className="schedule-date-panel">
      {/* 진행 표시 */}
      <div className="schedule-date-step">{step}/{totalSteps}</div>
      {/* 아이콘/질문 */}
      <div className="schedule-date-icon">📅</div>
      <div className="schedule-date-title">여행 기간은?</div>
      <div className="schedule-date-calendar-wrapper">
        <Calendar
          locale="ko-KR"
          minDetail="month"
          maxDetail="month"
          calendarType="gregory"
          formatDay={(_, date) => date.getDate()}
          value={startDate && endDate ? [startDate, endDate] : startDate ? startDate : null}
          selectRange={false}
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          tileContent={tileContent}
          onMouseOver={({ activeStartDate, date, view }) => setHoverDate(date)}
          prev2Label={null}
          next2Label={null}
        />
      </div>
      <div className="schedule-date-btns">
        <button className="calendar-reset-btn" onClick={onReset}>선택 해제</button>
        <button className="calendar-next-btn" onClick={onNext} disabled={!canNext}>다음</button>
      </div>
    </div>
  );
}

export default ScheduleDatePanel; 