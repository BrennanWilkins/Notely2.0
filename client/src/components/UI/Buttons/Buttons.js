import React from 'react';
import { xIcon, backIcon } from '../icons';
import './Buttons.css';

export const CloseBtn = ({ onClick, className }) => (
  <div
    className={`CloseBtn ${className || ''}`}
    onClick={onClick}
    tabIndex="0"
    onKeyPress={e => {
      if (e.key === 'Enter') {
        onClick();
      }
    }}
  >
    {xIcon}
  </div>
);

export const BackBtn = ({ onClick, className }) => (
  <div
    className={`BackBtn ${className || ''}`}
    onClick={onClick}
    tabIndex="0"
    onKeyPress={e => {
      if (e.key === 'Enter') {
        onClick();
      }
    }}
  >
    {backIcon}
  </div>
);
