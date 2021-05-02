import React, { useState } from 'react';
import './PassInput.css';
import PropTypes from 'prop-types';
import { eyeIcon, eyeHideIcon } from '../icons';

const PassInput = ({ className, value, onChange, placeholder }) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={`PassInput ${className || ''}`}>
      <input
        className="Input PassInput__input"
        type={showPass ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ''}
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
