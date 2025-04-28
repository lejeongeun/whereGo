import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';
import Pagination from 'react-bootstrap/Pagination';
import './ChecklistListPage.css';

const ChecklistListPage = ({ checklists, onDeleteChecklist, onToggleItem, onAddItem, onAddChecklist, onDeleteItem }) => {
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 페이지 이동 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // 현재 페이지에 해당하는 체크리스트 그룹만 추출
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentChecklists = checklists.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(checklists.length / itemsPerPage);

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
        {currentChecklists.map(checklist => (
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
                <div key={`${checklist.id}-${item.groupId || `item-${index}-${Date.now()}`}`} className="checklist-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => onToggleItem(checklist.id, item.groupId)}
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
      {/* Pagination 컴포넌트 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <Pagination className="custom-dark-pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => totalPages > 1 && setCurrentPage(idx + 1)}
              disabled={totalPages === 1}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default ChecklistListPage; 