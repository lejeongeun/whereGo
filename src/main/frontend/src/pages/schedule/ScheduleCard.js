import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ScheduleCard.css';

function EditableField({ value, onSave, placeholder, inputStyle, spanStyle }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);

  useEffect(() => { setInput(value); }, [value]);

  const handleSave = async () => {
    await onSave(input);
    setEditing(false);
  };

  return editing ? (
    <span style={{ display: 'block', width: '100%' }}>
      <input
        value={input}
        placeholder={placeholder}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
        style={{
          ...inputStyle,
          border: '1.5px solid #1976d2',
          borderRadius: 8,
          padding: '6px 12px',
          outline: 'none',
          marginRight: 8,
          transition: 'border 0.15s',
          width: '100%',
          boxSizing: 'border-box',
          display: 'block',
        }}
        autoFocus
      />
      <button
        style={{
          background: '#27ae60',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '1rem',
          padding: '7px 18px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(39,174,96,0.12)',
          transition: 'background 0.15s',
          marginTop: 4
        }}
        onMouseOver={e => e.currentTarget.style.background = '#219150'}
        onMouseOut={e => e.currentTarget.style.background = '#27ae60'}
        onClick={handleSave}
      >
        저장
      </button>
    </span>
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{
        ...spanStyle,
        borderRadius: 8,
        padding: '2px 6px',
        transition: 'background 0.15s',
        width: '100%',
        display: 'block',
        boxSizing: 'border-box',
        fontStyle: value ? undefined : 'italic',
        color: value ? (spanStyle?.color || '#222') : '#bbb',
        cursor: 'pointer',
      }}
      title={value ? '제목 수정' : ''}
    >
      {value || placeholder}
    </span>
  );
}

function ScheduleCard({ schedule, onDelete, onUpdate }) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // 일정 기간으로 day 개수 계산
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    setDays(Array.from({length: diff}, (_, i) => i + 1));
  }, [schedule]);

  useEffect(() => {
    api.get(`/schedule/${schedule.id}/getPlaces?day=${selectedDay}`)
      .then(res => {
        const filteredPlaces = (res.data || []).filter(place => place.dayNumber === selectedDay);
        setPlaces(filteredPlaces);
      });
  }, [schedule.id, selectedDay]);

  // 인라인 수정 핸들러
  const handleFieldSave = async (field, value) => {
    const updated = {...schedule, [field]: value};
    const res = await api.put(`/schedule/${schedule.id}`, updated);
    onUpdate(res.data);
    alert('저장되었습니다.');
  };

  return (
    <div className="schedule-card-modern">
      <span className="editable-title">
        <EditableField
          value={schedule.title}
          onSave={v => handleFieldSave('title', v)}
          placeholder="제목을 입력하세요"
          inputStyle={{ fontWeight: 700, fontSize: '1.15rem', color: '#222' }}
          spanStyle={{ fontWeight: 700, fontSize: '1.15rem', color: '#222' }}
        />
      </span>
      <span className="date-range">
        {schedule.startDate.slice(0,10)} ~ {schedule.endDate.slice(0,10)}
      </span>
      <span className="editable-desc">
        <EditableField
          value={schedule.description}
          onSave={v => handleFieldSave('description', v)}
          placeholder="설명을 입력하세요"
          inputStyle={{ fontWeight: 400, fontSize: '0.92rem', color: '#888' }}
          spanStyle={{ fontWeight: 400, fontSize: '0.92rem', color: '#888' }}
        />
      </span>
      {/* Day 탭: 최대 5개만 한 번에 보이고, 넘치면 가로 스크롤 */}
      <div
        className="day-tab-scroll"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 8,
          margin: '2px 0',
          maxWidth: 320,
          paddingBottom: 2,
        }}
      >
        {days.map(day => (
          <button
            key={day}
            style={{
              flex: '0 0 60px',
              minWidth: 60,
              padding: '6px 0',
              border: 'none',
              borderRadius: '18px',
              background: selectedDay === day ? '#1976d2' : '#f3f6fa',
              color: selectedDay === day ? '#fff' : '#222',
              fontWeight: selectedDay === day ? 700 : 500,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setSelectedDay(day)}
          >{`Day ${day}`}</button>
        ))}
      </div>
      {/* 장소 미리보기: 최대 3개만 보이고, 넘치면 세로 스크롤 */}
      <div
        className="place-list-scroll"
        style={{
          maxHeight: 216, // 기존 120 → 216 (4개 보이게)
          overflowY: 'auto',
          marginBottom: 8,
        }}
      >
        {places.map((place, idx) => (
          <div key={place.id} style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
            <img src={place.imageUrl} alt="" style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 8}} />
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600}}>
              {place.name}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 16
      }}>
        <button
          onClick={() => window.location.href = `/schedule/${schedule.id}`}
          style={{
            background: '#fff',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.98rem',
            padding: '6px 18px',
            minWidth: 48,
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e3f0fd'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >
          수정
        </button>
        <button
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.98rem',
            padding: '6px 18px',
            minWidth: 48,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#c0392b'}
          onMouseOut={e => e.currentTarget.style.background = '#e74c3c'}
          onClick={() => onDelete(schedule.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default ScheduleCard; 