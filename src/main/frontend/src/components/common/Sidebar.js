import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
  return (
    <div className="sidebar">
      <Link to="/" className="logo-link">
        <div className="logo">어디GO</div>
      </Link>

      <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      <ul className="menu">
        <li><Link to="/schedule">일정리스트</Link></li>
        <li><Link to="/weather">나라별 날씨</Link></li>
        <li><Link to="/exchange">나라별 환율</Link></li>
        <li><Link to="/checklist">체크리스트</Link></li>
        <li><Link to="/community">커뮤니티</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;