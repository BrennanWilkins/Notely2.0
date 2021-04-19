import React from 'react';
import './SettingsModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import DarkModeToggle from '../UI/DarkModeToggle/DarkModeToggle';
import { connect } from 'react-redux';
import { setNoteMargins, setNoteFontSize, setNoteListDisplay } from '../../store/actions';
import { marginOptions, fontSizeOptions, listDisplayOptions } from '../../utils/displayOptions';

const SettingsModal = props => {
  return (
    <ModalContainer close={props.close} title="Settings">
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
              ${props.noteMargin === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => props.setNoteMargins(opt)}
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
              ${props.noteFontSize === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => props.setNoteFontSize(opt)}
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
              ${props.noteListDisplay === opt ? 'SettingsModal__opt--active' : ''}
            `}
            onClick={() => props.setNoteListDisplay(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
    </ModalContainer>
  );
};

SettingsModal.propTypes = {
  close: PropTypes.func.isRequired,
  noteMargin: PropTypes.string.isRequired,
  noteFontSize: PropTypes.string.isRequired,
  noteListDisplay: PropTypes.string.isRequired,
  setNoteMargins: PropTypes.func.isRequired,
  setNoteFontSize: PropTypes.func.isRequired,
  setNoteListDisplay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  noteMargin: state.ui.noteMargin,
  noteFontSize: state.ui.noteFontSize,
  noteListDisplay: state.ui.noteListDisplay
});

const mapDispatchToProps = dispatch => ({
  setNoteMargins: size => dispatch(setNoteMargins(size)),
  setNoteFontSize: size => dispatch(setNoteFontSize(size)),
  setNoteListDisplay: size => dispatch(setNoteListDisplay(size))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
