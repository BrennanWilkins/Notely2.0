import React, { useRef } from 'react';
import './HelpPage.css';
import { Link } from 'react-router-dom';
import { logo, keyboardIcon, notesIcon, publishIcon, peopleIcon,
  personIcon, settingsIcon, backIcon } from '../UI/icons';
import { generalShortcuts, editorShortcuts } from './HelpPageContent';

const HelpPage = ({ isAuth }) => {
  const kbdRef = useRef();

  const scrollHandler = ref => {
    const top = ref.current.getBoundingClientRect().top - window.pageYOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

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
            <div className="HelpPage__link" onClick={() => scrollHandler(kbdRef)}>
              {keyboardIcon} Keyboard Shortcuts <span>{backIcon}</span>
            </div>
            <div className="HelpPage__link">
              {notesIcon} Notes <span>{backIcon}</span>
            </div>
            <div className="HelpPage__link">
              {publishIcon} Publishing <span>{backIcon}</span>
            </div>
            <div className="HelpPage__link">
              {peopleIcon} Collaborating <span>{backIcon}</span>
            </div>
            <div className="HelpPage__link">
              {personIcon} Account <span>{backIcon}</span>
            </div>
            <div className="HelpPage__link">
              {settingsIcon} Settings <span>{backIcon}</span>
            </div>
          </div>
        </div>
        <div className="HelpPage__infoContainer">
          <div className="HelpPage__section" ref={kbdRef}>
            <h2>Keyboard Shortcuts</h2>
            <h3>General Shortcuts</h3>
            <table className="HelpPage__shortcuts">
              <tbody>
                {generalShortcuts.map(sc => <KbdShortcut key={sc.name} {...sc} />)}
              </tbody>
            </table>
            <h3>Note Editor Shortcuts</h3>
            <table className="HelpPage__shortcuts">
              <tbody>
                {editorShortcuts.map(sc => <KbdShortcut key={sc.name} {...sc} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const KbdShortcut = ({ name, sc }) => (
  <tr>
    <td>{name}</td>
    <td>
      {sc.map(shortcut => <kbd key={shortcut}>{shortcut}</kbd>)}
    </td>
  </tr>
);

export default HelpPage;
