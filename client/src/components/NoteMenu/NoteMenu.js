import React, { useState } from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { expandIcon, contractIcon, trashIcon, shareIcon, pinIcon, arrowIcon } from '../UI/icons';
import { toggleFullscreen, trashNote, restoreNote, deleteNote,
  setListShown, pinNote, unpinNote } from '../../store/actions';
import Tooltip from '../UI/Tooltip/Tooltip';
import NoteStatus from './NoteStatus';
import ShareModal from '../ShareModal/ShareModal';
import Collaborators from './NoteCollaborators';

const NoteMenu = props => {
  const [showShareModal, setShowShareModal] = useState(false);

  const pinHandler = () => {
    props.noteIsPinned ?
    props.unpinNote(props.currentNoteID) :
    props.pinNote(props.currentNoteID);
  };

  return (
    <>
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
                <button className="NoteMenu__btn NoteMenu__iconBtn" onClick={() => setShowShareModal(true)}>
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
        {!!props.currentNoteID && <NoteStatus />}
        {props.isCollab && <Collaborators />}
      </div>
      {showShareModal && <ShareModal close={() => setShowShareModal(false)} />}
    </>
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
  isCollab: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen,
  trashShown: state.notes.trashShown,
  currentNoteID: state.notes.currentNoteID,
  noteIsPinned: !state.notes.currentNoteID ? false : state.notes.pinnedNotes.includes(state.notes.currentNoteID),
  isCollab: !state.notes.currentNoteID ? false : state.notes.notesByID[state.notes.currentNoteID].collaborators.length > 1
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
