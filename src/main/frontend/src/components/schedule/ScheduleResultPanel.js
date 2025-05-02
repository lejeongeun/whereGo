import React, { useState, useEffect } from 'react';

// 나라별 추천 장소 임시 데이터
const recommendedPlacesByCountry = {
  '미국': ['자유의 여신상', '타임스퀘어', '센트럴파크', '엠파이어 스테이트 빌딩'],
  '영국': ['빅벤', '런던아이', '타워브릿지', '버킹엄 궁전'],
  '프랑스': ['에펠탑', '루브르 박물관', '개선문', '베르사유 궁전'],
  '베트남': ['하롱베이', '호이안 고대도시', '사이공 중앙우체국', '노트르담 성당'],
  '중국': ['만리장성', '자금성', '천안문 광장', '테라코타 병마용'],
  '스페인': ['사그라다 파밀리아', '구엘공원', '프라도 미술관', '알함브라 궁전']
};

function getDayCount(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

function ScheduleResultPanel({ surveyAnswers, onReset }) {
  // localStorage에서 저장된 일정 데이터 불러오기
  const [scheduleData, setScheduleData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    const savedSchedule = localStorage.getItem('currentSchedule');
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      setScheduleData(parsedSchedule);
    }
  }, []);

  // 새로운 일정 짜기 핸들러
  const handleNewSchedule = () => {
    // 사용자 확인
    const isConfirmed = window.confirm(
      '새로운 일정을 작성하시겠습니까?\n현재 작성 중인 일정은 저장되지 않습니다.'
    );

    if (isConfirmed) {
      // localStorage 데이터 삭제
      localStorage.removeItem('currentSchedule');
      // 상태 초기화 및 첫 페이지로 이동
      if (onReset) {
        onReset();
      }
    }
  };

  // scheduleData가 없으면 로딩 표시
  if (!scheduleData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '1.1rem',
        color: '#888'
      }}>
        일정을 불러오는 중...
      </div>
    );
  }

  const { startDate, endDate, city } = scheduleData;
  const dayCount = getDayCount(startDate, endDate);

  // 선택된 나라의 추천 장소들
  const recommendedPlaces = recommendedPlacesByCountry[city] || [];

  // 스크롤바 스타일을 위한 공통 CSS
  const scrollableContainerStyle = {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: '-ms-autohiding-scrollbar',
    paddingBottom: '8px', // 스크롤바 공간
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxWidth: 400,
      margin: '-5px auto',
    }}>
      {/* 추천 장소 섹션 */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '24px',
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          추천 장소<span style={{fontSize:'1.3rem'}}>✨</span>
        </div>
        <div style={scrollableContainerStyle}>
          <div style={{
            display: 'flex',
            gap: '15px',
            minWidth: 'min-content',
          }}>
            {recommendedPlaces.map((place, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 150px',
                  height: '100px',
                  background: '#f3f6fa',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  wordBreak: 'keep-all',
                }}
              >
                {place}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일정 섹션 */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '24px',
      }}>
        {/* DAY 탭 */}
        <div style={scrollableContainerStyle}>
          <div style={{
            display: 'flex',
            gap: '8px',
            minWidth: 'min-content',
            marginBottom: '24px',
          }}>
            {Array.from({length: dayCount}, (_, i) => (
              <button
                key={i+1}
                onClick={() => setSelectedDay(i+1)}
                style={{
                  flex: '0 0 100px',
                  padding: '6px 0',
                  border: 'none',
                  borderRadius: '18px',
                  background: selectedDay === i+1 ? '#1976d2' : '#f3f6fa',
                  color: selectedDay === i+1 ? '#fff' : '#222',
                  fontWeight: selectedDay === i+1 ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {`Day ${i+1}`}
              </button>
            ))}
          </div>
        </div>

        {/* 일정 리스트 공간 */}
        <div style={{
          width:'100%',
          minHeight:'200px',
          background:'#fafbfc',
          borderRadius:'12px',
          padding:'24px',
          boxSizing:'border-box',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontSize:'1.1rem',
          color:'#888'
        }}>
          아직 일정이 없습니다
        </div>
      </div>

      {/* 새로운 일정 짜기 버튼 */}
      <button
        onClick={handleNewSchedule}
        style={{
          width: '100%',
          padding: '16px 0',
          background: '#4f8cff',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.15rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 0.15s',
          boxShadow: '0 2px 8px rgba(79,140,255,0.12)',
        }}
      >
        새로운 일정 짜기
      </button>
    </div>
  );
}

export default ScheduleResultPanel; 