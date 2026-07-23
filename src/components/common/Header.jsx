// src/components/common/Header.jsx

import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <h1>Trip Planner</h1>
        </div>
        <nav className="nav">
          <span className="nav-text">ELD Log Generator</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;