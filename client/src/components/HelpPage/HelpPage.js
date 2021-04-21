import React, { useRef, useState } from 'react';
import './HelpPage.css';
import { Link } from 'react-router-dom';
import { logo, keyboardIcon, notesIcon, publishIcon, peopleIcon,
  personIcon, settingsIcon, backIcon } from '../UI/icons';
import { generalShortcuts, editorShortcuts, notesContent, pubContent,
collabContent, accntContent, settingsContent } from './HelpPageContent';

const HelpPage = ({ isAuth }) => {
  const kbdRef = useRef();
  const notesRef = useRef();
  const pubRef = useRef();
  const collabRef = useRef();
  const accntRef = useRef();
  const settingsRef = useRef();

  const scrollHandler = ref => {
    const top = ref.current.getBoundingClientRect().top + window.pageYOffset - 100;
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
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(kbdRef)}
            >
              {keyboardIcon} Keyboard Shortcuts <span>{backIcon}</span>
            </div>
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(notesRef)}
            >
              {notesIcon} Notes <span>{backIcon}</span>
            </div>
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(pubRef)}
            >
              {publishIcon} Publishing <span>{backIcon}</span>
            </div>
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(collabRef)}
            >
              {peopleIcon} Collaborating <span>{backIcon}</span>
            </div>
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(accntRef)}
            >
              {personIcon} Account <span>{backIcon}</span>
            </div>
            <div
              className="HelpPage__link"
              onClick={() => scrollHandler(settingsRef)}
            >
              {settingsIcon} Settings <span>{backIcon}</span>
            </div>
          </div>
        </div>
        <div className="HelpPage__infoContainer">
          <section ref={kbdRef}>
            <h2>Keyboard Shortcuts</h2>
            <h3>General Shortcuts</h3>
            <table className="HelpPage__shortcuts">
              <tbody>
                {generalShortcuts.map(sc => (
                  <KbdShortcut key={sc.name} {...sc} />
                ))}
              </tbody>
            </table>
            <h3>Note Editor Shortcuts</h3>
            <table className="HelpPage__shortcuts">
              <tbody>
                {editorShortcuts.map(sc => (
                  <KbdShortcut key={sc.name} {...sc} />
                ))}
              </tbody>
            </table>
          </section>
          <section ref={notesRef}>
            <h2>Notes</h2>
            {notesContent.map((text, i) => (
              <HelpQA key={i} question={text.q} answer={text.a} />
            ))}
          </section>
          <section ref={pubRef}>
            <h2>Publishing</h2>
            {pubContent.map((text, i) => (
              <HelpQA key={i} question={text.q} answer={text.a} />
            ))}
          </section>
          <section ref={collabRef}>
            <h2>Collaborating</h2>
            {collabContent.map((text, i) => (
              <HelpQA key={i} question={text.q} answer={text.a} />
            ))}
          </section>
          <section ref={accntRef}>
            <h2>Account</h2>
            {accntContent.map((text, i) => (
              <HelpQA key={i} question={text.q} answer={text.a} />
            ))}
          </section>
          <section ref={settingsRef}>
            <h2>Settings</h2>
            {settingsContent.map((text, i) => (
              <HelpQA key={i} question={text.q} answer={text.a} />
            ))}
          </section>
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

const HelpQA = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div
      className={`HelpPage__QA ${showAnswer ? 'HelpPage__QA--toggled' : ''}`}
      onClick={() => setShowAnswer(shown => !shown)}
    >
      <div className="HelpPage__question">
        {question}
        <span>{backIcon}</span>
      </div>
      {showAnswer &&
        <div className="HelpPage__answer">
          {answer}
        </div>
      }
    </div>
  );
};

export default HelpPage;
