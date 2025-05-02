import React, { useState, useEffect } from 'react';
import api from '../../api';

const ScheduleTab = ({ userEmail }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 새 일정 상태
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    date: '',
    description: ''
  });

  // 첫 렌더링 시 일정 데이터 가져오기
  useEffect(() => {
    fetchSchedules();
  }, [userEmail]);
  
  // 일정 데이터 가져오기
  const fetchSchedules = async () => {
    if (!userEmail) return;
    
    try {
      setLoading(true);
      const response = await api.get('/schedule', {
        params: { email: userEmail },
        withCredentials: true
      });
      
      setScheduleItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('일정 데이터 로드 실패:', err);
      setError('일정을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };
  
  // 새 일정 입력값 변경 핸들러
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 새 일정 추가
  const addScheduleItem = async () => {
    if (newSchedule.title.trim() === '' || newSchedule.date === '') return;
    
    try {
      const response = await api.post('/schedule', {
        title: newSchedule.title.trim(),
        date: newSchedule.date,
        description: newSchedule.description.trim(),
        email: userEmail
      }, {
        withCredentials: true
      });
      
      // 새 일정 추가
      setScheduleItems(prevItems => [...prevItems, response.data]);
      
      // 입력 필드 초기화
      setNewSchedule({
        title: '',
        date: '',
        description: ''
      });
    } catch (err) {
      console.error('일정 추가 실패:', err);
      setError('새 일정을 추가하는데 실패했습니다.');
    }
  };
  
  // 일정 삭제
  const deleteScheduleItem = async (id) => {
    try {
      await api.delete(`/schedule/${id}`, {
        withCredentials: true
      });
      
      // 상태에서 일정 제거
      setScheduleItems(prevItems => 
        prevItems.filter(item => item.id !== id)
      );
    } catch (err) {
      console.error('일정 삭제 실패:', err);
      setError('일정을 삭제하는데 실패했습니다.');
    }
  };
  
  return (
    <div className="schedule-section">          
      {/* 일정 목록 */}
      <div className="schedule-list">
        {scheduleItems.length > 0 ? (
          scheduleItems
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => (
              <div key={item.id} className="schedule-item">
                <div className="schedule-header">
                  <h3>{item.title}</h3>
                  <button 
                    className="delete-button"
                    onClick={() => deleteScheduleItem(item.id)}
                  >
                    삭제
                  </button>
                </div>
                <div className="schedule-date">{item.date}</div>
                {item.description && (
                  <div className="schedule-description">{item.description}</div>
                )}
              </div>
            ))
        ) : (
          <p className="no-items">일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;