import React from 'react';
import './HelpPage.css';
import { Link } from 'react-router-dom';
import { logo, keyboardIcon, notesIcon, publishIcon, peopleIcon,
  personIcon, settingsIcon, backIcon } from '../UI/icons';

const HelpPage = ({ isAuth }) => {
  return (
    <div className="HelpPage">
      <div className="HelpPage__nav">
        <div className="HelpPage__title">
          {logo} Notely <span>Help</span>
        </div>
        <Link to="/" className="Btn BlueBtn HelpPage__backBtn">
          {isAuth ? 'Back to my notes' : 'Back to login'}
        </Link>
      </div>
      <div className="HelpPage__content">
        <div className="HelpPage__linkContainer">
          <div className="HelpPage__linksTitle">Topics</div>
          <div className="HelpPage__links">
            <div className="HelpPage__link">{keyboardIcon} Keyboard shortcuts <span>{backIcon}</span></div>
            <div className="HelpPage__link">{notesIcon} Notes <span>{backIcon}</span></div>
            <div className="HelpPage__link">{publishIcon} Publishing <span>{backIcon}</span></div>
            <div className="HelpPage__link">{peopleIcon} Collaborating <span>{backIcon}</span></div>
            <div className="HelpPage__link">{personIcon} Account <span>{backIcon}</span></div>
            <div className="HelpPage__link">{settingsIcon} Settings <span>{backIcon}</span></div>
          </div>
        </div>
        <div className="HelpPage__infoContainer">
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
