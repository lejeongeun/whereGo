import React, { useState, useEffect } from 'react';
import { getPlacesByScheduleAndDay, deletePlaceFromSchedule, addPlaceToSchedule } from '../../api/scheduleApi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../api';

// 나라별 추천 장소 더미 데이터
const recommendedPlacesByCountry = {
  '미국': [
    {
      name: 'Statue of Liberty',
      img: '/resources/img/statue_of_liberty.jpg',
      address: 'Liberty Island, New York, NY 10004, USA',
      latitude: 40.6892,
      longitude: -74.0445
    },
    {
      name: 'Times Square',
      img: '/resources/img/times_square.jpg',
      address: 'Manhattan, NY 10036, USA',
      latitude: 40.7580,
      longitude: -73.9855
    },
    {
      name: 'Central Park',
      img: '/resources/img/central_park.jpg',
      address: 'New York, NY, USA',
      latitude: 40.785091,
      longitude: -73.968285
    },
    {
      name: 'Empire State Building',
      img: '/resources/img/empire_state_building.jpg',
      address: '20 W 34th St, New York, NY 10001, USA',
      latitude: 40.748817,
      longitude: -73.985428
    }
  ],
  '영국': [
    {
      name: 'Big Ben',
      img: '/resources/img/big_ben.jpg',
      address: 'Westminster, London SW1A 0AA, United Kingdom',
      latitude: 51.500729,
      longitude: -0.124625
    },
    {
      name: 'London Eye',
      img: '/resources/img/london_eye.jpg',
      address: 'Riverside Building, County Hall, London SE1 7PB, United Kingdom',
      latitude: 51.503324,
      longitude: -0.119543
    },
    {
      name: 'Tower Bridge',
      img: '/resources/img/tower_bridge.jpg',
      address: 'Tower Bridge Rd, London SE1 2UP, United Kingdom',
      latitude: 51.505456,
      longitude: -0.075356
    },
    {
      name: 'Buckingham Palace',
      img: '/resources/img/buckingham_palace.jpg',
      address: 'London SW1A 1AA, United Kingdom',
      latitude: 51.501364,
      longitude: -0.14189
    }
  ],
  '프랑스': [
    {
      name: 'Eiffel Tower',
      img: '/resources/img/eiffel_tower.jpg',
      address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
      latitude: 48.858370,
      longitude: 2.294481
    },
    {
      name: 'Louvre Museum',
      img: '/resources/img/louvre_museum.jpg',
      address: 'Rue de Rivoli, 75001 Paris, France',
      latitude: 48.860611,
      longitude: 2.337644
    },
    {
      name: 'Arc de Triomphe',
      img: '/resources/img/arc_de_triomphe.jpg',
      address: 'Place Charles de Gaulle, 75008 Paris, France',
      latitude: 48.873792,
      longitude: 2.295028
    },
    {
      name: 'Palace of Versailles',
      img: '/resources/img/palace_of_versailles.jpg',
      address: 'Place d\'Armes, 78000 Versailles, France',
      latitude: 48.804865,
      longitude: 2.120355
    }
  ],
  '베트남': [
    {
      name: 'Ha Long Bay',
      img: '/resources/img/ha_long_bay.jpg',
      address: 'Thành phố Hạ Long, Quảng Ninh, Vietnam',
      latitude: 20.910051,
      longitude: 107.183902
    },
    {
      name: 'Hoi An Ancient Town',
      img: '/resources/img/hoi_an_ancient_town.jpg',
      address: 'Phường Minh An, Hội An, Quảng Nam, Vietnam',
      latitude: 15.880058,
      longitude: 108.338047
    },
    {
      name: 'Saigon Central Post Office',
      img: '/resources/img/saigon_central_post_office.jpg',
      address: '2 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam',
      latitude: 10.779783,
      longitude: 106.699018
    },
    {
      name: 'Notre-Dame Cathedral Basilica of Saigon',
      img: '/resources/img/notre_dame_cathedral_saigon.jpg',
      address: '01 Công xã Paris, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Vietnam',
      latitude: 10.779783,
      longitude: 106.699208
    }
  ],
  '중국': [
    {
      name: 'Great Wall of China',
      img: '/resources/img/great_wall_of_china.jpg',
      address: 'Huairou, China, 101406 (Badaling Section)',
      latitude: 40.431908,
      longitude: 116.570374
    },
    {
      name: 'Forbidden City',
      img: '/resources/img/forbidden_city.jpg',
      address: '4 Jingshan Front St, Dongcheng, Beijing, China, 100009',
      latitude: 39.916345,
      longitude: 116.397155
    },
    {
      name: 'Tiananmen Square',
      img: '/resources/img/tiananmen_square.jpg',
      address: 'Dongcheng, Beijing, China, 100006',
      latitude: 39.905963,
      longitude: 116.391248
    },
    {
      name: 'Terracotta Army',
      img: '/resources/img/terracotta_army.jpg',
      address: "Lintong, Xi'an, Shaanxi, China",
      latitude: 34.3846,
      longitude: 109.2732
    }
  ],
  '스페인': [
    {
      name: 'Sagrada Família',
      img: '/resources/img/sagrada_familia.jpg',
      address: 'C/ de Mallorca, 401, 08013 Barcelona, Spain',
      latitude: 41.4036299,
      longitude: 2.1743558
    },
    {
      name: 'Park Güell',
      img: '/resources/img/park_guell.jpg',
      address: '08024 Barcelona, Spain',
      latitude: 41.414494,
      longitude: 2.152694
    },
    {
      name: 'Prado Museum',
      img: '/resources/img/prado_museum.jpg',
      address: 'C. de Ruiz de Alarcón, 23, 28014 Madrid, Spain',
      latitude: 40.413780,
      longitude: -3.692127
    },
    {
      name: 'Alhambra',
      img: '/resources/img/alhambra.jpg',
      address: 'C. Real de la Alhambra, s/n, 18009 Granada, Spain',
      latitude: 37.176077,
      longitude: -3.588141
    }
  ]
};

function getDayCount(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

function ScheduleResultPanel({ 
  surveyAnswers, 
  onReset, 
  selectedDay, 
  setSelectedDay,
  dayPlaces,
  setDayPlaces,
  fetchDayPlaces
}) {
  // localStorage에서 저장된 일정 데이터 불러오기
  const [scheduleData, setScheduleData] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.email;
    if (userId) {
      const savedSchedule = localStorage.getItem(`currentSchedule_${userId}`);
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        setScheduleData(parsedSchedule);
        if (parsedSchedule.id) setScheduleId(parsedSchedule.id);
      }
    }
  }, []);

  useEffect(() => {
    if (scheduleId && selectedDay) {
      fetchDayPlaces(selectedDay);
    }
    // eslint-disable-next-line
  }, [scheduleId, selectedDay]);

  // 장소 추가 후 즉시 UI 업데이트를 위한 함수
  const handlePlaceAdded = (newPlace) => {
    setDayPlaces(prevPlaces => [...prevPlaces, newPlace]);
  };

  // 새로운 일정 짜기 핸들러
  const handleNewSchedule = () => {
    // 사용자 확인
    const isConfirmed = window.confirm(
      '새로운 일정을 작성하시겠습니까?\n현재 작성 중인 일정은 저장되지 않습니다.'
    );

    if (isConfirmed) {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.email;
      if (userId) {
        localStorage.removeItem(`currentSchedule_${userId}`);
      }
      // 상태 초기화 및 첫 페이지로 이동
      if (onReset) {
        onReset();
      }
    }
  };

  // 추천 장소를 일정에 추가하는 함수
  const onAddRecommendedPlace = async (place) => {
    try {
      const savedPlace = await addPlaceToSchedule({
        name: place.name,
        address: place.address || '',
        latitude: place.latitude,
        longitude: place.longitude,
        scheduleId: scheduleId,
        dayNumber: selectedDay,
        imageUrl: place.img
      });
      setDayPlaces(prev => [...prev, savedPlace]);
    } catch (error) {
      alert('추천 장소를 일정에 추가하는 데 실패했습니다.');
    }
  };

  // 순서 재정렬 함수
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = reorder(dayPlaces, result.source.index, result.destination.index);
    // order 1부터 재정렬
    const orderList = reordered.map((place, idx) => ({
      id: place.id,
      order: idx + 1
    }));
    try {
      console.log('orderList to send:', orderList); // 실제 전송 데이터 확인
      await api.patch('/places/reorder', orderList);
      setDayPlaces(reordered);
    } catch (e) {
      console.error('순서 저장 에러:', e); // 에러 상세 출력
      alert('순서 저장에 실패했습니다.');
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
        background: '#f0f4ff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '3px 0px 8px 8px',
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginLeft: '10px',
          marginTop: '2px',
        }}>
          추천 장소<span style={{fontSize:'1.3rem'}}>✨</span>
        </div>
        <div className="recommended-scrollbar" style={scrollableContainerStyle}>
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
                  height: '152px',
                  background: '#f3f6fa',
                  padding: 0,
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  wordBreak: 'keep-all',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.15s',
                  overflow: 'hidden', // 카드 전체에 overflow hidden 적용
                }}
                onClick={() => onAddRecommendedPlace(place)}
              >
                {place.img && (
                  <div style={{
                    width: '100%',
                    height: '120px',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    overflow: 'hidden',
                    margin: 0,
                    background: '#f3f6fa',
                    display: 'flex',
                  }}>
                    <img src={place.img} alt={place.name} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 0}} />
                  </div>
                )}
                <span style={{fontWeight:600, fontSize:'1.08rem', marginTop: 0, marginBottom: 3}}>{place.name}</span>
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
        padding: '16px 24px 24px 24px',
      }}>
        {/* DAY 탭 */}
        <div className="daytab-scrollbar" style={scrollableContainerStyle}>
          <div style={{
            display: 'flex',
            gap: '8px',
            minWidth: 'min-content',
            marginBottom: '8px',
          }}>
            {Array.from({length: dayCount}, (_, i) => {
              const dayNumber = i + 1;
              return (
                <button
                  key={dayNumber}
                  onClick={async () => {
                    console.log('Selected day:', dayNumber);
                    setSelectedDay(dayNumber);
                    try {
                      await fetchDayPlaces(dayNumber);
                    } catch (error) {
                      console.error('Error fetching places for day:', dayNumber, error);
                    }
                  }}
                  style={{
                    flex: '0 0 100px',
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '18px',
                    background: selectedDay === dayNumber ? '#1976d2' : '#f3f6fa',
                    color: selectedDay === dayNumber ? '#fff' : '#222',
                    fontWeight: selectedDay === dayNumber ? 700 : 500,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`Day ${dayNumber}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 일정 리스트 공간 */}
        <div style={{
          width:'100%',
          minHeight:'200px',
          background:'#fafbfc',
          borderRadius:'12px',
          padding:'24px 0',
          boxSizing:'border-box',
          fontSize:'1.1rem',
          color:'#222',
        }}>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="places-droppable">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {!scheduleData ? (
                    <li style={{ color:'#888', display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                      일정을 불러오는 중...
                    </li>
                  ) : dayPlaces.length === 0 ? (
                    <li style={{ color:'#888', display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                      아직 일정이 없습니다
                    </li>
                  ) : (
                    dayPlaces.map((place, idx) => (
                      <Draggable key={place.id} draggableId={String(place.id)} index={idx}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: 16,
                              margin: '0 0 16px 0',
                              minHeight: '80px',
                              background: snapshot.isDragging ? '#e3f2fd' : '#fff',
                              color: '#222',
                              borderRadius: 12,
                              boxShadow: snapshot.isDragging
                                ? '0 8px 24px rgba(33, 150, 243, 0.25)'
                                : '0 2px 8px rgba(0,0,0,0.06)',
                              transition: 'box-shadow 0.2s, background 0.2s, transform 0.2s',
                              transform: snapshot.isDragging ? 'scale(1.03)' : 'scale(1)',
                              opacity: 1,
                              zIndex: snapshot.isDragging ? 20 : 1,
                              cursor: 'grab',
                              position: 'relative',
                              ...provided.draggableProps.style
                            }}
                          >
                            <button
                              className="place-delete-btn"
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: -32,
                                background: 'none',
                                border: 'none',
                                color: '#e74c3c',
                                fontSize: '2.2rem',
                                cursor: 'pointer',
                                zIndex: 100,
                                padding: '6px 10px',
                                lineHeight: 1,
                              }}
                              title="삭제"
                              onMouseDown={e => e.stopPropagation()}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (String(place.id).startsWith('recommended-')) {
                                  setDayPlaces(prev => prev.filter(p => p.id !== place.id));
                                } else {
                                  try {
                                    await deletePlaceFromSchedule(place.id);
                                    setDayPlaces(prev => prev.filter(p => p.id !== place.id));
                                  } catch (err) {
                                    alert('삭제에 실패했습니다.');
                                  }
                                }
                              }}
                            >
                              &minus;
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              {/* 이미지 영역 */}
                              <div style={{
                                width: 70,
                                height: 70,
                                borderRadius: 8,
                                overflow: 'hidden',
                                background: '#f3f6fa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {place.imageUrl ? (
                                  <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span style={{ color: '#bbb', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <rect x="3" y="3" width="18" height="18" rx="2" />
                                      <path d="M3 17l6-6 4 4 8-8" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              {/* 텍스트 영역 */}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '1.08rem' }}>{place.name}</div>
                                <div style={{ fontSize: '0.97rem', color: '#555' }}>{place.address}</div>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
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