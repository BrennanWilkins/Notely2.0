import React from 'react';
import './SettingsModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import DarkModeToggle from '../UI/DarkModeToggle/DarkModeToggle';
import { connect } from 'react-redux';
import { setNoteMargins, setNoteFontSize, setNoteListDisplay } from '../../store/actions';
import { marginOptions, fontSizeOptions, listDisplayOptions } from '../../utils/displayOptions';
import { downloadNotes } from '../../utils/downloadNotes';

const SettingsModal = ({
  close,
  margins,
  fontSize,
  display,
  setMargins,
  setFontSize,
  setDisplay
}) => (
  <ModalContainer close={close} title="Settings">
    <DarkModeToggle />
    <div className="SettingsModal__title">
      Note Margins
    </div>
    <div className="SettingsModal__options">
      {marginOptions.map(opt => (
        <SettingsOption
          key={opt}
          opt={opt}
          isActive={margins === opt}
          onClick={() => setMargins(opt)}
        />
      ))}
    </div>
    <div className="SettingsModal__title">
      Note font size
    </div>
    <div className="SettingsModal__options">
      {fontSizeOptions.map(opt => (
        <SettingsOption
          key={opt}
          opt={opt}
          isActive={fontSize === opt}
          onClick={() => setFontSize(opt)}
        />
      ))}
    </div>
    <div className="SettingsModal__title">
      Note list display
    </div>
    <div className="SettingsModal__options">
      {listDisplayOptions.map(opt => (
        <SettingsOption
          key={opt}
          opt={opt}
          isActive={display === opt}
          onClick={() => setDisplay(opt)}
        />
      ))}
    </div>
    <div
      className="SettingsModal__opt SettingsModal__export"
      onClick={downloadNotes}
      tabIndex="0"
      onKeyPress={e => {
        if (e.key === 'Enter') {
          e.currentTarget.click();
        }
      }}
    >
      Export Notes
    </div>
  </ModalContainer>
);

const SettingsOption = ({ onClick, opt, isActive }) => (
  <div
    className={`
      SettingsModal__opt
      ${isActive ? 'SettingsModal__opt--active' : ''}
    `}
    onClick={onClick}
    tabIndex="0"
    onKeyPress={e => {
      if (e.key === 'Enter') {
        e.currentTarget.click();
      }
    }}
  >
    {opt}
  </div>
);

SettingsModal.propTypes = {
  close: PropTypes.func.isRequired,
  margins: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  setMargins: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  margins: state.ui.noteMargins,
  fontSize: state.ui.noteFontSize,
  display: state.ui.noteListDisplay
});

const mapDispatchToProps = dispatch => ({
  setMargins: size => dispatch(setNoteMargins(size)),
  setFontSize: size => dispatch(setNoteFontSize(size)),
  setDisplay: size => dispatch(setNoteListDisplay(size))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
