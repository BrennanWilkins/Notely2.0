import React from 'react';
import './Avatar.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip/Tooltip';

const Avatar = ({ color, username, status }) => (
  <div className="Avatar" style={{ background: color }}>
    <div
      className="Avatar__name"
      style={{ color: status === 'Offline' ? 'black' : 'white' }}
    >
      {username[0]}
    </div>
    {status === 'Inactive' && <div className="Avatar__symb" />}
    <Tooltip position="down">
      {username}
      <div>Status: {status}</div>
    </Tooltip>
  </div>
);

Avatar.propTypes = {
  color: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Avatar;
