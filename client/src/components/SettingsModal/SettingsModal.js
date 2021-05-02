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
}) => {
  const keyPressHandler = e => {
    if (e.key === 'Enter') {
      e.currentTarget.click();
    }
  };

  return (
    <ModalContainer close={close} title="Settings">
      <DarkModeToggle />
      <div className="SettingsModal__title">
        Note Margins
      </div>
      <div className="SettingsModal__options">
        {marginOptions.map(opt => (
          <div
            key={opt}
            className={`
              SettingsModal__opt
              ${margins === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => setMargins(opt)}
            tabIndex="0"
            onKeyPress={keyPressHandler}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className="SettingsModal__title">
        Note font size
      </div>
      <div className="SettingsModal__options">
        {fontSizeOptions.map(opt => (
          <div
            key={opt}
            className={`
              SettingsModal__opt
              ${fontSize === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => setFontSize(opt)}
            tabIndex="0"
            onKeyPress={keyPressHandler}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className="SettingsModal__title">
        Note list display
      </div>
      <div className="SettingsModal__options">
        {listDisplayOptions.map(opt => (
          <div
            key={opt}
            className={`
              SettingsModal__opt
              ${display === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => setDisplay(opt)}
            tabIndex="0"
            onKeyPress={keyPressHandler}
          >
            {opt}
          </div>
        ))}
      </div>
      <div
        className="SettingsModal__opt SettingsModal__export"
        onClick={downloadNotes}
        tabIndex="0"
        onKeyPress={keyPressHandler}
      >
        Export Notes
      </div>
    </ModalContainer>
  );
};

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
