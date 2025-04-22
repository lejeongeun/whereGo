import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import NewChecklistPage from './NewChecklistPage';
import ChecklistListPage from './ChecklistListPage';
import './ChecklistPage.css';

const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // localStorage에서 체크리스트 데이터 불러오기 (컴포넌트 마운트 시 1회만 실행)
  useEffect(() => {
    try {
      const savedChecklists = localStorage.getItem('checklists');
      if (savedChecklists) {
        const parsedChecklists = JSON.parse(savedChecklists);
        if (Array.isArray(parsedChecklists)) {
          setChecklists(parsedChecklists);
          console.log('Loaded checklists from localStorage:', parsedChecklists);
        }
      }
    } catch (error) {
      console.error('Error loading checklists from localStorage:', error);
    }
    setInitialized(true);
  }, []);
 
  // 체크리스트 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    // 초기화가 완료된 후에만 저장 실행
    if (initialized) {
      try {
        console.log('Saving checklists to localStorage:', checklists);
        localStorage.setItem('checklists', JSON.stringify(checklists));
      } catch (error) {
        console.error('Error saving checklists to localStorage:', error);
      }
    }
  }, [checklists, initialized]);

  const handleSaveChecklist = (checklist) => {
    if (!checklist.title.trim() || checklist.items.length === 0) {
      alert('제목과 최소 1개 이상의 항목이 필요합니다.');
      return;
    }

    const newChecklist = {
      id: checklists.length > 0 ? Math.max(...checklists.map(list => list.id)) + 1 : 1,
      title: checklist.title,
      items: checklist.items.map((item, index) => ({
        id: index + 1,
        text: item.text,
        checked: item.checked
      }))
    };

    setChecklists([...checklists, newChecklist]);
    setIsModalOpen(false);
  };

  const handleDeleteChecklist = (id) => {
    setChecklists(checklists.filter(list => list.id !== id));
  };

  const handleToggleItem = (checklistId, itemId) => {
    setChecklists(checklists.map(list => {
      if (list.id === checklistId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return list;
    }));
  };

  const handleAddItem = (checklistId, newItem) => {
    setChecklists(checklists.map(list => {
      if (list.id === checklistId) {
        return {
          ...list,
          items: [...list.items, newItem]
        };
      }
      return list;
    }));
  };

  const handleDeleteItem = (checklistId, itemId) => {
    setChecklists(checklists.map(list => {
      if (list.id === checklistId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  };

  const EmptyState = () => (
    <div className="empty-checklist">
      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        <AiOutlinePlus size={40} />
      </button>
    </div>
  );

  return (
    <div className="checklist-container">
      <h1>체크리스트</h1>
      {checklists.length > 0 ? (
        <ChecklistListPage
          checklists={checklists}
          onDeleteChecklist={handleDeleteChecklist}
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
