import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TripScheduleContainer from '../../components/schedule/TripScheduleContainer';
import './TripSchedulePage.css';
import api from '../../api';

function TripSchedulePage({ isEditMode }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isNew = params.get('new') === '1';

    if (!id && !isNew) {
      // 기존 로직: 일정 있으면 /schedules로 이동
      const checkSchedules = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const res = await api.get('/schedule/allPlaces');
          if (Array.isArray(res.data) && res.data.length > 0) {
            navigate('/schedules', { replace: true });
          }
        } catch (e) {}
      };
      checkSchedules();
    }
    // isNew === true면 무조건 설문부터 시작 (임시데이터 삭제 등)
    // TripScheduleContainer에서 임시데이터가 없으면 설문부터 시작하도록 이미 구현되어 있으면 추가 로직 불필요
  }, [navigate, id, location.search]);

  return <TripScheduleContainer isEditMode={isEditMode} id={id} />;
}

export default TripSchedulePage;