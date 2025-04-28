//
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistApi } from '../../api/checklistApi';
import { AiOutlinePlus } from 'react-icons/ai';
import NewChecklistPage from './NewChecklistPage';
import ChecklistListPage from './ChecklistListPage';
import './ChecklistPage.css';

const ChecklistPage = () => {
  const navigate = useNavigate();
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const groups = await checklistApi.getAllGroups();
        setChecklistGroups(groups);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setError('체크리스트를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchChecklistGroups();
    }
  }, [navigate]);

  const handleSaveChecklist = async (checklist) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const groupData = {
        title: checklist.title,
        items: checklist.items.map(item => ({
          item: item.text,
          isChecked: false
        }))
      };
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
