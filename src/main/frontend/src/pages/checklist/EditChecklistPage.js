import React, { useState } from 'react';

const EditChecklistPage = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, { text: newItem, checked: false }]);
      setNewItem('');
    }
  };

  const handleToggleItem = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  return (
    <div className="edit-checklist-container">
      <h1>체크리스트 편집</h1>
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="새로운 항목 추가"
        />
        <button type="submit">추가</button>
      </form>
      <div className="checklist-items">
        {items.map((item, index) => (
          <div key={index} className="checklist-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleToggleItem(index)}
            />
            <span className={item.checked ? 'checked' : ''}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditChecklistPage; 