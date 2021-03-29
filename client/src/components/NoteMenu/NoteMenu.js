import React from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  expandIcon,
  contractIcon,
  trashIcon,
  shareIcon,
  pinIcon,
  arrowIcon,
  checkIcon
} from '../UI/icons';
import {
  toggleFullscreen,
  trashNote,
  restoreNote,
  deleteNote,
  setListShown,
  pinNote,
  unpinNote
} from '../../store/actions';
import Tooltip from '../UI/Tooltip/Tooltip';
import { formatDate } from '../../utils/formatDate';

const NoteMenu = props => {
  const pinHandler = () => {
    props.noteIsPinned ?
    props.unpinNote(props.currentNoteID) :
    props.pinNote(props.currentNoteID);
  };

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
              <button
                className={`NoteMenu__btn NoteMenu__iconBtn ${props.noteIsPinned ? 'NoteMenu__btn--hl' : ''}`}
                onClick={pinHandler}
              >
                {pinIcon}
                <Tooltip position="down">{props.noteIsPinned ? 'Unpin' : 'Pin to top'}</Tooltip>
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
      {!!props.currentNoteID &&
        <div className="NoteMenu__info">
          <div className="NoteMenu__date">Last updated {formatDate(props.updatedAt)}</div>
          <div className="NoteMenu__status">{checkIcon} All changes saved</div>
        </div>
      }
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
  showList: PropTypes.func.isRequired,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired,
  noteIsPinned: PropTypes.bool.isRequired,
  updatedAt: PropTypes.string
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen,
  trashShown: state.notes.trashShown,
  currentNoteID: state.notes.currentNoteID,
  updatedAt:
    !state.notes.currentNoteID ? null :
    state.notes.trashShown ? state.notes.trash.byID[state.notes.currentNoteID].updatedAt || null :
    state.notes.notes.byID[state.notes.currentNoteID].updatedAt || null,
  noteIsPinned: state.notes.pinnedNotes.includes(state.notes.currentNoteID)
});

const mapDispatchToProps = dispatch => ({
  toggleFullscreen: () => dispatch(toggleFullscreen()),
  trashNote: () => dispatch(trashNote()),
  restoreNote: () => dispatch(restoreNote()),
  deleteNote: () => dispatch(deleteNote()),
  showList: () => dispatch(setListShown(true)),
  pinNote: noteID => dispatch(pinNote(noteID)),
  unpinNote: noteID => dispatch(unpinNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteMenu));
