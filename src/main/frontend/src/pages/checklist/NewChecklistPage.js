import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import './NewChecklistPage.css';

const NewChecklistPage = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, { text: newItem.trim(), checked: false }]);
      setNewItem('');
      setError('');
    } else {
      setError('항목을 입력해주세요.');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (items.length === 0) {
      setError('최소 하나의 항목을 추가해주세요.');
      return;
    }
    
    onSave({ title: title.trim(), items });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="title-input"
          />
        </div>
        <div className="modal-body">
          <div className="add-item-section">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="항목 추가"
              className="item-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem(e)}
            />
            <button onClick={handleAddItem} className="add-item-button">
              <AiOutlinePlus size={20} />
              항목 추가
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="items-list">
            {items.map((item, index) => (
              <div key={index} className="item">
                <span>{item.text}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="remove-item-button"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            취소
          </button>
          <button onClick={handleSubmit} className="save-button" disabled={!title.trim() || items.length === 0}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChecklistPage; 