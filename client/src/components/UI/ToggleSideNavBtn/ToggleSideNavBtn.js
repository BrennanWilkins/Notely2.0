import React from 'react';
import './ToggleSideNavBtn.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip/Tooltip';
import { doubleChevronIcon } from '../icons';

const ToggleSideNavBtn = ({ onClick, isExpanded }) => (
  <div
    onClick={onClick}
    className={`
      ToggleSideNavBtn
      ${isExpanded ? 'ToggleSideNavBtn--left' : 'ToggleSideNavBtn--right'}
    `}
  >
    {doubleChevronIcon}
    <Tooltip position="right">
      {isExpanded ? 'Collapse Menu' : 'Expand Menu'}
      <div>Alt+Shift+M</div>
    </Tooltip>
  </div>
);

ToggleSideNavBtn.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ToggleSideNavBtn;
