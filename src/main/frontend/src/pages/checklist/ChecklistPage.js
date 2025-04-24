//
import React, { useState, useEffect } from 'react';
import { checklistApi } from '../../api/checklistApi';
import { AiOutlinePlus } from 'react-icons/ai';
import NewChecklistPage from './NewChecklistPage';
import ChecklistListPage from './ChecklistListPage';
import './ChecklistPage.css';

const ChecklistPage = () => {
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 체크리스트 그룹 불러오기
  useEffect(() => {
    const fetchChecklistGroups = async () => {
      try {
        setLoading(true);
        const groups = await checklistApi.getAllGroups();
        setChecklistGroups(groups);
      } catch (err) {
        setError('체크리스트를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklistGroups();
  }, []);

  const handleSaveChecklist = async (checklist) => {
    try {
      setLoading(true);
      // 그룹 생성
      const groupData = {
        title: checklist.title,
        items: checklist.items.map(item => ({
          item: item.text,
          isChecked: false
        }))
      };
      await checklistApi.createGroup(groupData);
      
      // 목록 새로고침
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
      setIsModalOpen(false);
    } catch (err) {
      setError('체크리스트 저장에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setLoading(true);
      await checklistApi.deleteGroup(groupId);
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('체크리스트 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (groupId, itemId) => {
    try {
      setLoading(true);
      await checklistApi.toggleItem(groupId, itemId);
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('항목 상태 변경에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (groupId, newItem) => {
    try {
      setLoading(true);
      await checklistApi.addItem(groupId, { item: newItem.text, isChecked: false });
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('항목 추가에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (groupId, itemId) => {
    try {
      setLoading(true);
      await checklistApi.deleteItem(groupId, itemId);
      const updatedGroups = await checklistApi.getAllGroups();
      setChecklistGroups(updatedGroups);
    } catch (err) {
      setError('항목 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = () => (
    <div className="empty-checklist">
      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        <AiOutlinePlus size={40} />
      </button>
    </div>
  );

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
