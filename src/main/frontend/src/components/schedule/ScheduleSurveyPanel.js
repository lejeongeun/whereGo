import React from 'react';

// 여행 가능한 나라 목록
const cities = [ '미국', '영국', '프랑스', '베트남', '중국', '스페인' ];

/**
 * 여행 설문의 첫 번째 단계 - 나라 선택을 담당하는 컴포넌트
 */
function ScheduleSurveyPanel({ step, totalSteps, answer, onSelect, onNext }) {
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
      {/* 진행 표시 */}
      <div style={{position:'absolute',top:20,right:32,fontSize:'1rem',color:'#888'}}>
        {step}/{totalSteps}
      </div>
      {/* 아이콘/로고 */}
      <div style={{marginBottom: '16px', fontSize: '2.5rem'}}>
        <span role="img" aria-label="flag">🚩</span>
      </div>
      {/* 질문 */}
      <div style={{fontWeight:700, fontSize:'1.3rem', marginBottom:'8px', textAlign:'center'}}>
        떠나고 싶은 나라는?
      </div>
      <div style={{fontSize:'1rem', color:'#888', marginBottom:'32px', textAlign:'center'}}>
        나라 1곳을 선택해주세요.
      </div>
      {/* 나라 선택 버튼 */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'16px',justifyContent:'center',marginBottom:'40px',width:'100%'}}>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            style={{
              flex:'1 1 40%',
              minWidth:120,
              maxWidth:160,
              padding:'18px 0',
              border:'none',
              borderRadius:'12px',
              background: answer === city ? '#4f8cff' : '#f3f6fa',
              color: answer === city ? '#fff' : '#222',
              fontWeight:600,
              fontSize:'1.1rem',
              cursor:'pointer',
              boxShadow: answer === city ? '0 2px 8px rgba(79,140,255,0.12)' : 'none',
              outline: answer === city ? '2px solid #4f8cff' : 'none',
              transition:'all 0.15s'
            }}
          >
            {city}
          </button>
        ))}
      </div>
      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={!answer}
        style={{
          width:'100%',
          padding:'16px 0',
          background: answer ? '#4f8cff' : '#bcd6fa',
          color:'#fff',
          border:'none',
          borderRadius:'10px',
          fontSize:'1.15rem',
          fontWeight:700,
          cursor: answer ? 'pointer' : 'not-allowed',
          transition:'background 0.15s'
        }}
      >
        다음
      </button>
    </div>
  );
}

export default ScheduleSurveyPanel; 