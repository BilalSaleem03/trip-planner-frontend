// src/components/common/Card.jsx

import React from 'react';
import './Card.css';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const classes = [
    'card',
    `card-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;