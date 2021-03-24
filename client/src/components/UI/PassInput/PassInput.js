import React, { useState } from 'react';
import './PassInput.css';
import PropTypes from 'prop-types';
import { eyeIcon, eyeHideIcon } from '../icons';

const PassInput = props => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={`PassInput ${props.className || ''}`}>
      <input
        className="PassInput__input"
        type={showPass ? 'text' : 'password'}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder || ''}
      />
      <div className="PassInput__eye" onClick={() => setShowPass(show => !show)}>
        {showPass ? eyeHideIcon : eyeIcon}
      </div>
    </div>
  );
};

PassInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string
};

export default PassInput;
