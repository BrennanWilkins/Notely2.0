import React from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { expandIcon, contractIcon, trashIcon, shareIcon, pinIcon, arrowIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleFullscreen, trashNote, restoreNote, deleteNote, setListShown } from '../../store/actions';
import Tooltip from '../UI/Tooltip/Tooltip';

const NoteMenu = props => {
  return (
    <div className="NoteMenu">
      <div className="NoteMenu__btns">
        <button className="NoteMenu__btn NoteMenu__fsBtn" onClick={props.toggleFullscreen}>
          {props.isFullscreen ? contractIcon : expandIcon}
          <Tooltip position="down">Fullscreen<div>Ctrl+Shift+F</div></Tooltip>
        </button>
        <button className="NoteMenu__btn NoteMenu__backBtn" onClick={props.showList}>
          {arrowIcon}
          <Tooltip position="down">Back<div>Ctrl+Shift+B</div></Tooltip>
        </button>
        <div className="NoteMenu__options">
          {!!props.currentNoteID && (props.trashShown ?
            <>
              <button className="NoteMenu__btn NoteMenu__trashBtn" onClick={props.restoreNote}>
                Restore
              </button>
              <button className="NoteMenu__btn NoteMenu__trashBtn" onClick={props.deleteNote}>
                Delete Forever
              </button>
            </>
            :
            <>
              <button className="NoteMenu__btn NoteMenu__iconBtn">
                {pinIcon}
                <Tooltip position="down">Pin to top</Tooltip>
              </button>
              <button className="NoteMenu__btn NoteMenu__iconBtn">
                {shareIcon}
                <Tooltip position="down">Share</Tooltip>
              </button>
              <button className="NoteMenu__btn NoteMenu__iconBtn" onClick={props.trashNote}>
                {trashIcon}
                <Tooltip position="down">Send to trash</Tooltip>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

NoteMenu.propTypes = {
  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  trashNote: PropTypes.func.isRequired,
  trashShown: PropTypes.bool.isRequired,
  restoreNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  currentNoteID: PropTypes.string,
  showList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen,
  trashShown: state.notes.trashShown,
  currentNoteID: state.notes.currentNoteID
});

const mapDispatchToProps = dispatch => ({
  toggleFullscreen: () => dispatch(toggleFullscreen()),
  trashNote: () => dispatch(trashNote()),
  restoreNote: () => dispatch(restoreNote()),
  deleteNote: () => dispatch(deleteNote()),
  showList: () => dispatch(setListShown(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteMenu));
