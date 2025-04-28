import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';
import './ChecklistListPage.css';

const ChecklistListPage = ({ checklists, onDeleteChecklist, onToggleItem, onAddItem, onAddChecklist, onDeleteItem }) => {
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [newItemText, setNewItemText] = useState('');

  const handleDeleteChecklist = (id, title) => {
    if (window.confirm(`'${title}' 체크리스트를 정말 삭제하시겠습니까?`)) {
      onDeleteChecklist(id);
    }
  };

  const handleAddItem = (checklistId) => {
    setEditingChecklistId(checklistId);
    setNewItemText('');
  };

  const handleNewItemSubmit = (checklistId, e) => {
    alert("submit");
    e.preventDefault();
    if (newItemText.trim()) {
      const newItem = {
        text: newItemText.trim(),
        checked: false
      };
      console.log('ChecklistListPage에서 전달되는 newItem:', newItem);
      onAddItem(checklistId, newItem);
    }
    setEditingChecklistId(null);
    setNewItemText('');
  };

  return (
    <div className="checklist-list-container">
      <div className="checklists-grid">
        {checklists.map(checklist => (
          <div key={checklist.id} className="checklist-card">
            <div className="checklist-header">
              <h2>{checklist.title}</h2>
              <button
                className="delete-button"
                onClick={() => handleDeleteChecklist(checklist.id, checklist.title)}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="checklist-items">
              {checklist.items.map((item, index) => (
                <div key={`${checklist.id}-${item.groupId || index}`} className="checklist-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => {
                        if (!item.groupId) {
                          console.error('Item groupId가 없습니다:', item);
                          return;
                        }
                        onToggleItem(checklist.id, item.groupId);
                      }}
                    />
                    <span className={item.isChecked ? 'checked' : ''}>
                      {item.item}
                    </span>
                  </label>
                  <button
                    className="delete-item-button"
                    onClick={() => onDeleteItem(checklist.id, item.groupId)}
                  >
                    <AiOutlineMinus />
                  </button>
                </div>
              ))}
              {editingChecklistId === checklist.id ? (
                <form 
                  className="new-item-form"
                  onSubmit={(e) => handleNewItemSubmit(checklist.id, e)}
                >
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="새 항목 입력"
                    autoFocus
                    className="new-item-input"
                  />
                  <button type="submit" className="save-button">
                    저장
                    </button>
                </form>
              ) : (
                <button
                  className="add-item-button"
                  onClick={() => handleAddItem(checklist.id)}
                >
                  <AiOutlinePlus />
                  <span>항목 추가</span>
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="add-checklist-card">
          <button className="add-checklist-button" onClick={onAddChecklist}>
            <AiOutlinePlus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistListPage; 