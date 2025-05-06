import React, { useState, useRef, useEffect } from 'react';
import './schedule.css';

const PlaceTypeFilter = ({ selectedType, onTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 타입별 레이블 및 값 매핑
  const placeTypes = [
    { label: 'Restaurants', value: 'restaurants' },
    { label: 'Attractions', value: 'attractions' }
  ];

  // 현재 선택된 타입 레이블 찾기
  const selectedTypeLabel = placeTypes.find(type => type.value === selectedType)?.label || 'Type';
  
  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 타입 변경 핸들러
  const handleTypeSelect = (typeValue) => {
    onTypeChange(typeValue);
    setIsOpen(false);
  };

  return (
    <div className="place-type-filter" ref={dropdownRef}>
      <div 
        className="selected-type"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedTypeLabel}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="type-dropdown">
          {placeTypes.map((type) => (
            <div 
              key={type.value}
              className={`type-option ${selectedType === type.value ? 'active' : ''}`}
              onClick={() => handleTypeSelect(type.value)}
            >
              {type.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceTypeFilter;