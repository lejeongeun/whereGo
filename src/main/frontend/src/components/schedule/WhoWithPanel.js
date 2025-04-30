import React from 'react';

const whoWithOptions = ['혼자', '친구와', '연인과', '부모님과', '기타'];

function WhoWithPanel({ step, totalSteps, answer, onSelect, onNext }) {
  // answer는 배열이어야 함
  const isSelected = (option) => Array.isArray(answer) && answer.includes(option);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: '32px 32px 24px 32px',
      maxWidth: 400,
      margin: '32px auto',
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
      {/* 아이콘 */}
      <div style={{marginBottom: '16px', fontSize: '2.5rem'}}>
        <span role="img" aria-label="sunglasses">😎</span>
      </div>
      {/* 질문 */}
      <div style={{fontWeight:700, fontSize:'1.3rem', marginBottom:'8px', textAlign:'center'}}>
        누구와 떠나나요?
      </div>
      <div style={{fontSize:'1rem', color:'#888', marginBottom:'32px', textAlign:'center'}}>
        다중 선택이 가능해요.
      </div>
      {/* 선택 버튼 */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'16px',justifyContent:'center',marginBottom:'40px',width:'100%'}}>
        {whoWithOptions.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            style={{
              flex:'1 1 40%',
              minWidth:120,
              maxWidth:160,
              padding:'18px 0',
              border:'none',
              borderRadius:'12px',
              background: isSelected(option) ? '#4f8cff' : '#f3f6fa',
              color: isSelected(option) ? '#fff' : '#222',
              fontWeight:600,
              fontSize:'1.1rem',
              cursor:'pointer',
              boxShadow: isSelected(option) ? '0 2px 8px rgba(79,140,255,0.12)' : 'none',
              outline: isSelected(option) ? '2px solid #4f8cff' : 'none',
              transition:'all 0.15s'
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {/* 다음 버튼 */}
      <button
        onClick={onNext}
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
        다음
      </button>
    </div>
  );
}

export default WhoWithPanel; 