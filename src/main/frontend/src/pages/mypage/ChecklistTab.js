import React, { useState, useEffect } from 'react';
import { checklistApi } from '../../api/checklistApi';

const ChecklistTab = ({ userEmail, viewOnly = false }) => {
  // 체크리스트 그룹 상태
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  
  // 첫 렌더링 시 체크리스트 데이터 가져오기
  useEffect(() => {
    fetchChecklistGroups();
  }, []);
  
  // 체크리스트 그룹 데이터 가져오기
  const fetchChecklistGroups = async () => {
    try {
      setLoading(true);
      // 새로운 API 사용
      const groupsData = await checklistApi.getAllGroups();
      
      setGroups(groupsData);
      
      // 그룹이 있으면 첫 번째 그룹을 활성화
      if (groupsData.length > 0) {
        setActiveGroupId(groupsData[0].id);
      }
      
      setLoading(false);
      setApiAvailable(true);
      setError(null);
    } catch (err) {
      console.error('체크리스트 데이터 로드 실패:', err);
      
      if (err.message === '로그인이 필요합니다.') {
        setError('체크리스트를 보려면 로그인이 필요합니다.');
      } else {
        setError('체크리스트를 불러오는데 실패했습니다.');
      }
      
      setLoading(false);
      setApiAvailable(false);
    }
  };
  
  // 체크 상태 토글 함수
  const handleToggleItem = async (groupId, itemId) => {
    if (viewOnly) return;
    
    try {
      await checklistApi.toggleItem(groupId, itemId);
      
      // 상태 업데이트
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              items: group.items.map(item => {
                if (item.id === itemId) {
                  return { ...item, isChecked: !item.isChecked };
                }
                return item;
              })
            };
          }
          return group;
        })
      );
    } catch (err) {
      console.error('항목 상태 변경 실패:', err);
      setError('항목 상태 변경에 실패했습니다.');
    }
  };
  
  // 현재 활성화된 그룹
  const activeGroup = groups.find(group => group.id === activeGroupId);
  
  // API 사용 불가능
  if (!apiAvailable) {
    return (
      <div className="checklist-section">
        <h2>체크리스트</h2>
        <div className="error-message">{error}</div>
        <div className="no-items">
          <p>현재 체크리스트 기능을 사용할 수 없습니다.</p>
          <button 
            className="retry-button"
            onClick={fetchChecklistGroups}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checklist-section">
      <h2>체크리스트</h2>
      {error && <div className="error-message">{error}</div>}
      
      {/* 그룹 선택 드롭다운 */}
      <div className="checklist-group-header">
        <div className="group-selector">
          <select 
            value={activeGroupId || ''} 
            onChange={(e) => setActiveGroupId(Number(e.target.value))}
            disabled={groups.length === 0}
          >
            {groups.length === 0 ? (
              <option value="">그룹 없음</option>
            ) : (
              groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      
      {/* 활성 그룹의 체크리스트 항목 */}
{activeGroup ? (
  <div className="checklist-items">
    {/* 항목 목록 */}
    <div className="checklist-list">
      {activeGroup.items && activeGroup.items.length > 0 ? (
        activeGroup.items.map(item => (
          <div key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.isChecked}
              disabled={viewOnly}
              onChange={() => !viewOnly && handleToggleItem(activeGroup.id, item.id)}
            />
            <div className="checklist-item-content">
              <span className={item.isChecked ? 'completed' : ''}>
                {item.item}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="no-items">체크리스트 항목이 없습니다.</p>
      )}
    </div>
  </div>
) : (
  <p className="no-items">체크리스트가 없습니다.</p>
)}
    </div>
  );
};

export default ChecklistTab;