import React from 'react';
import './ToggleSideNavBtn.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip/Tooltip';
import { doubleChevronIcon } from '../icons';

const ToggleSideNavBtn = ({ onClick, isExpanded }) => (
  <div
    onClick={e => {
      e.currentTarget.blur();
      onClick();
    }}
    className={`
      ToggleSideNavBtn
      ${isExpanded ? 'ToggleSideNavBtn--left' : 'ToggleSideNavBtn--right'}
    `}
    tabIndex="0"
    onKeyPress={e => {
      if (e.key === 'Enter') {
        e.currentTarget.click();
      }
    }}
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
