import React from 'react';

const styleOptions = [
  '체험·액티비티',
  'SNS 핫플레이스',
  '자연과 함께',
  '유명 관광지는 필수',
  '여유롭게 힐링',
  '관광보다 먹방',
  '쇼핑은 열정적으로'
];

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function TravelStylePanel({ step, totalSteps, answer, onSelect, onNext, onGoBack, surveyAnswers, onCreateSchedule }) {
  // answer는 배열
  const isSelected = (option) => Array.isArray(answer) && answer.includes(option);
  const optionRows = chunkArray(styleOptions, 2);

  // 다중 선택 핸들러
  const handleSelect = (option) => {
    if (!Array.isArray(answer)) return;
    if (isSelected(option)) {
      onSelect(answer.filter((item) => item !== option));
    } else {
      onSelect([...answer, option]);
    }
  };

  // 일정 만들기 버튼 클릭 핸들러
  const handleCreateSchedule = async () => {
    const scheduleData = {
      ...surveyAnswers,
      title: (surveyAnswers.city ? `${surveyAnswers.city} 여행` : '나의 여행'),
      description: '', // 필요시 입력란 추가 가능
      style: answer,
      createdAt: new Date().toISOString()
    };
    if (onCreateSchedule) {
      await onCreateSchedule(scheduleData);
    }
    onNext();
  };

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
        <span role="img" aria-label="camera">📷</span>
      </div>
      {/* 질문 */}
      <div style={{fontWeight:700, fontSize:'1.3rem', marginBottom:'8px', textAlign:'center'}}>
        내가 선호하는 여행 스타일은?
      </div>
      <div style={{fontSize:'1rem', color:'#888', marginBottom:'32px', textAlign:'center'}}>
        다중 선택이 가능해요.
      </div>
      {/* 선택 버튼 - 행 단위로 렌더링 */}
      <div style={{width:'100%', marginBottom:'40px'}}>
        {optionRows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-start',
              marginBottom: idx === optionRows.length - 1 ? 0 : '16px',
            }}
          >
            {row.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                style={{
                  flex: '1 1 40%',
                  minWidth: 120,
                  maxWidth: 160,
                  padding: '18px 0',
                  border: 'none',
                  borderRadius: '12px',
                  background: isSelected(option) ? '#4f8cff' : '#f3f6fa',
                  color: isSelected(option) ? '#fff' : '#222',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: isSelected(option) ? '0 2px 8px rgba(79,140,255,0.12)' : 'none',
                  outline: isSelected(option) ? '2px solid #4f8cff' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* 일정 만들기 버튼 */}
      <button
        onClick={handleCreateSchedule}
        disabled={!answer || !Array.isArray(answer) || answer.length === 0}
        style={{
          width:'100%',
          padding:'16px 0',
          background: answer && Array.isArray(answer) && answer.length > 0 ? '#4f8cff' : '#bcd6fa',
          color:'#fff',
          border:'none',
          borderRadius:'10px',
          fontSize:'1.15rem',
          fontWeight:700,
          cursor: answer && Array.isArray(answer) && answer.length > 0 ? 'pointer' : 'not-allowed',
          transition:'background 0.15s'
        }}
      >
        일정 만들기
      </button>
    </div>
  );
}

export default TravelStylePanel; 