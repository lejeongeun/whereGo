//
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistApi } from '../../api/checklistApi';
import { AiOutlinePlus } from 'react-icons/ai';
import NewChecklistPage from './NewChecklistPage';
import ChecklistListPage from './ChecklistListPage';
import './ChecklistPage.css';
// import axios from 'axios';

const ChecklistPage = () => {
  const navigate = useNavigate();
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // 체크리스트 그룹 불러오기
  useEffect(() => {
    const fetchChecklistGroups = async () => {
      try {
        const groups = await checklistApi.getAllGroups();
        console.log('체크리스트 그룹 데이터:', groups);
        // 데이터 구조 확인 및 수정
        const formattedGroups = groups.map(group => ({
          ...group,
          items: group.items.map(item => ({
            ...item,
            id: item.id || item.checklistId, // id가 없는 경우 checklistId 사용
            isChecked: item.isChecked || false
          }))
        }));
        setChecklistGroups(formattedGroups);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setError('체크리스트를 불러오는데 실패했습니다.');
        console.error(err);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchChecklistGroups();
    }
  }, [navigate]);

  const handleSaveChecklist = async (checklist) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const groupData = {
        title: checklist.title,
        items: checklist.items.map(item => ({
          item: item.text,
          isChecked: item.checked ?? false
        }))
      };
      console.log('저장되는 groupData:', groupData);
      await checklistApi.createGroup(groupData);
      
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
      setIsModalOpen(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setError('체크리스트 저장에 실패했습니다.');
      console.error(err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await checklistApi.deleteGroup(groupId);
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('체크리스트 삭제에 실패했습니다.');
      console.error(err);
    }
  };

  const handleToggleItem = async (checklistId, itemId) => {
    try {
      if (!itemId) {
        console.error('아이템 ID가 없습니다.');
        return;
      }

      const checklist = checklistGroups.find(c => c.id === checklistId);
      if (!checklist) {
        console.error('체크리스트를 찾을 수 없습니다.');
        return;
      }

      const item = checklist.items.find(i => i.id === itemId);
      if (!item) {
        console.error('항목을 찾을 수 없습니다.');
        return;
      }

      await checklistApi.toggleItem(checklistId, itemId);
      const updatedChecklists = checklistGroups.map(checklist => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map(item => 
              item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
            )
          };
        }
        return checklist;
      });
      setChecklistGroups(updatedChecklists);
    } catch (error) {
      console.error('항목 토글 중 오류 발생:', error);
    }
  };

  const handleAddItem = async (groupId, newItem) => {
    try {
      await checklistApi.addItem(groupId, { item: newItem.text, isChecked: false });
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('항목 추가에 실패했습니다.');
      console.error(err);
    }
  };

  const handleDeleteItem = async (checklistId, itemId) => {
    try {
      if (!itemId) {
        console.error('아이템 ID가 없습니다.');
        return;
      }

      const checklist = checklistGroups.find(c => c.id === checklistId);
      if (!checklist) {
        console.error('체크리스트를 찾을 수 없습니다.');
        return;
      }

      const item = checklist.items.find(i => i.id === itemId);
      if (!item) {
        console.error('항목을 찾을 수 없습니다.');
        return;
      }

      await checklistApi.deleteItem(checklistId, itemId);
      const updatedChecklists = checklistGroups.map(checklist => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.filter(item => item.id !== itemId)
          };
        }
        return checklist;
      });
      setChecklistGroups(updatedChecklists);
    } catch (error) {
      console.error('항목 삭제 중 오류 발생:', error);
    }
  };

  const EmptyState = () => (
    <div className="empty-checklist">
      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        <AiOutlinePlus size={40} />
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="checklist-container">
        <h1>체크리스트</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="checklist-container">
      <h1>체크리스트</h1>
      {checklistGroups.length > 0 ? (
        <ChecklistListPage
          checklists={checklistGroups}
          onDeleteChecklist={handleDeleteGroup}
          onToggleItem={handleToggleItem}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onAddChecklist={() => setIsModalOpen(true)}
        />
      ) : (
        <EmptyState />
      )}
      {isModalOpen && (
        <NewChecklistPage
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChecklist}
        />
      )}
    </div>
  );
};

export default ChecklistPage;
