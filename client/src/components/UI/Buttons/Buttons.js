import React from 'react';
import { xIcon, backIcon } from '../icons';
import './Buttons.css';

export const CloseBtn = props => (
  <div
    className={`CloseBtn ${props.className || ''}`}
    onClick={props.onClick}
    tabIndex="0"
  >
    {xIcon}
  </div>
);

export const BackBtn = props => (
  <div
    className={`BackBtn ${props.className || ''}`}
    onClick={props.onClick}
    tabIndex="0"
  >
    {backIcon}
  </div>
);
