import React from 'react';
import './Avatar.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip/Tooltip';

const Avatar = props => (
  <div className="Avatar" style={{ background: props.color }}>
    <div className="Avatar__name">{props.username[0]}</div>
    {props.status === 'Inactive' && <div className="Avatar__symb" />}
    <Tooltip position="down">{props.username}<div>Status: {props.status}</div></Tooltip>
  </div>
);

Avatar.propTypes = {
  color: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Avatar;
