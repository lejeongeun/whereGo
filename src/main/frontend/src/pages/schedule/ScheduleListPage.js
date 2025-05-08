import React, { useEffect, useState } from 'react';
import ScheduleCard from './ScheduleCard';
import api from '../../api';
import '../checklist/ChecklistListPage.css'; // checklist의 pagination 스타일 import

const ITEMS_PER_PAGE = 6;

function ScheduleListPage() {
  const [schedules, setSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.get('/schedule/allPlaces').then(res => {
      // console.log('allPlaces 응답:', res.data);
      setSchedules(res.data);
    });
  }, []);

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSchedules = schedules.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await api.delete(`/schedule/${id}/delete`);
      setSchedules(schedules.filter(s => s.id !== id));
      alert('삭제되었습니다.');
    }
  };

  const handleUpdate = (updated) => {
    setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '32px 0 24px 0'
      }}>
        <button
          onClick={() => {
            // 임시 일정 데이터 삭제
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.email;
            if (userId) {
              localStorage.removeItem(`currentSchedule_${userId}`);
            }
            window.location.href = '/schedule?new=1';
          }}
          style={{
            background: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 48px',
            boxShadow: '0 2px 8px rgba(56,135,254,0.12)',
            cursor: 'pointer',
            transition: 'background 0.15s'
          }}
        >
          새로운 일정 만들기
        </button>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        width: '100%',
        margin: '0 auto',
        flexWrap: 'wrap'
      }}>
        {currentSchedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
      <div className="pagination-container">
        <ul className="custom-dark-pagination pagination">
          <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>이전</button>
          </li>
          {Array.from({ length: totalPages }, (_, idx) => (
            <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>다음</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ScheduleListPage; 