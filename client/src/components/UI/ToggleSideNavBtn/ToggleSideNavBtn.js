import React from 'react';
import './ToggleSideNavBtn.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip/Tooltip';
import { doubleChevronIcon } from '../icons';

const ToggleSideNavBtn = props => (
  <div
    onClick={props.onClick}
    className={`ToggleSideNavBtn ${props.isExpanded ? 'ToggleSideNavBtn--left' : 'ToggleSideNavBtn--right'}`}
  >
    {doubleChevronIcon}
    <Tooltip position="right">
      {props.isExpanded ? 'Collapse Menu' : 'Expand Menu'}
      <div>Ctrl+M</div>
    </Tooltip>
  </div>
);

ToggleSideNavBtn.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ToggleSideNavBtn;
