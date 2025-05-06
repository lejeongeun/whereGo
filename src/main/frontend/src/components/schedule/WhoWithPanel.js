import React from 'react';

const whoWithOptions = ['혼자', '친구와', '연인과', '부모님과', '기타'];

// 옵션을 2개씩 나누는 함수
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function WhoWithPanel({ step, totalSteps, answer, onSelect, onNext, onGoBack }) {
  // answer가 문자열인지 확인
  const isSelected = (option) => answer === option;
  const optionRows = chunkArray(whoWithOptions, 2);

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
        <span role="img" aria-label="sunglasses">😎</span>
      </div>
      {/* 질문 */}
      <div style={{fontWeight:700, fontSize:'1.3rem', marginBottom:'8px', textAlign:'center'}}>
        누구와 떠나나요?
      </div>
      <div style={{fontSize:'1rem', color:'#888', marginBottom:'32px', textAlign:'center'}}>
        하나만 선택해주세요.
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
            onClick={() => onSelect(option)}
            style={{
                  flex: '1 1 40%',
                  minWidth: 160,
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

export default WhoWithPanel; 