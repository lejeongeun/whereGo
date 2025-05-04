import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './schedule.css';

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
  return start && end && date > start && date < end;
}

function ScheduleDatePanel({ step, totalSteps, startDate, endDate, onDateChange, onNext, onReset, onGoBack }) {
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
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: '32px 32px 24px 32px',
      maxWidth: 400,
      margin: '-5px auto',
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative'
    }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={onGoBack}
        style={{
          position: 'absolute',
          top: 20,
          left: 32,
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          color: '#888',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ←
      </button>
      {/* 진행 표시 */}
      <div style={{position:'absolute',top:20,right:32,fontSize:'1rem',color:'#888'}}>
        {step}/{totalSteps}
      </div>
      {/* 아이콘 */}
      <div style={{marginBottom: '16px', fontSize: '2.5rem'}}>
        <span role="img" aria-label="calendar">📅</span>
      </div>
      {/* 질문 */}
      <div style={{fontWeight:700, fontSize:'1.3rem', marginBottom:'8px', textAlign:'center'}}>
        여행 기간은?
      </div>
      <div style={{fontSize:'1rem', color:'#888', marginBottom:'32px', textAlign:'center'}}>
        날짜를 선택해주세요.
      </div>
      {/* 달력 */}
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
          minDate={new Date()}
        />
      </div>
      {/* 버튼 영역 */}
      <div className="schedule-date-btns">
        <button className="calendar-reset-btn" onClick={onReset}>선택 해제</button>
        <button className="calendar-next-btn" onClick={onNext} disabled={!canNext}>다음</button>
      </div>
    </div>
  );
}

export default ScheduleDatePanel; 