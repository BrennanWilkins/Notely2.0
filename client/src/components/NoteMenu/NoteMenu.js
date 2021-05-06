import React, { useState } from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { expandIcon, contractIcon, trashIcon, shareIcon, pinIcon,
  arrowIcon, publishIcon, dotsIcon } from '../UI/icons';
import { toggleFullscreen, trashNote, restoreNote, deleteNote,
  setListShown, pinNote, unpinNote } from '../../store/actions';
import { selectNoteIsPinned, selectIsCollab } from '../../store/selectors';
import Tooltip from '../UI/Tooltip/Tooltip';
import NoteStatus from './NoteStatus';
import ShareModal from '../ShareModal/ShareModal';
import Collaborators from './NoteCollaborators';
import PublishModal from '../PublishModal/PublishModal';
import NoteOptions from './NoteOptions';

const NoteMenu = ({
  toggleFS,
  isFS,
  trashNote,
  trashShown,
  restoreNote,
  deleteNote,
  noteID,
  showList,
  pinNote,
  unpinNote,
  isPinned,
  isCollab,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showNoteOptions, setShowNoteOptions] = useState(false);

  const pinHandler = () => {
    isPinned ? unpinNote(noteID) : pinNote(noteID);
  };

  return (
    <>
      <div className="NoteMenu">
        <div className="NoteMenu__btns">
          <button
            className="NoteMenu__btn NoteMenu__fsBtn"
            onClick={toggleFS}
          >
            {isFS ? contractIcon : expandIcon}
            <Tooltip position="down">
              Fullscreen
              <div>Alt+Shift+F</div>
            </Tooltip>
          </button>
          <button
            className="NoteMenu__btn NoteMenu__backBtn"
            onClick={showList}
          >
            {arrowIcon}
            <Tooltip position="down">
              Back
              <div>Alt+Shift+B</div>
            </Tooltip>
          </button>
          <div className="NoteMenu__options">
            {!!noteID && (trashShown ?
              <>
                <button
                  className="NoteMenu__btn NoteMenu__trashBtn"
                  onClick={restoreNote}
                >
                  Restore
                </button>
                <button
                  className="NoteMenu__btn NoteMenu__trashBtn"
                  onClick={deleteNote}
                >
                  Delete Forever
                </button>
              </>
              :
              <>
                <button
                  className={`
                    NoteMenu__btn
                    NoteMenu__iconBtn
                    ${isPinned ? 'NoteMenu__btn--hl' : ''}
                  `}
                  onClick={pinHandler}
                >
                  {pinIcon}
                  <Tooltip position="down">
                    {isPinned ? 'Unpin' : 'Pin to top'}
                  </Tooltip>
                </button>
                <button
                  className="NoteMenu__btn NoteMenu__iconBtn"
                  onClick={() => setShowShareModal(true)}
                >
                  {shareIcon}
                  <Tooltip position="down">Share</Tooltip>
                </button>
                <button
                  className="NoteMenu__btn NoteMenu__iconBtn"
                  onClick={() => setShowPublishModal(true)}
                >
                  {publishIcon}
                  <Tooltip position="down">Publish</Tooltip>
                </button>
                <button
                  className="NoteMenu__btn NoteMenu__iconBtn"
                  onClick={trashNote}
                >
                  {trashIcon}
                  <Tooltip position="down">Send to trash</Tooltip>
                </button>
                <button
                  className="NoteMenu__btn NoteMenu__iconBtn"
                  onClick={() => setShowNoteOptions(true)}
                >
                  {dotsIcon}
                </button>
              </>
            )}
          </div>
        </div>
        {showNoteOptions && <NoteOptions close={() => setShowNoteOptions(false)} />}
        {!!noteID && <NoteStatus />}
        {isCollab && <Collaborators />}
      </div>
      {showShareModal && <ShareModal close={() => setShowShareModal(false)} />}
      {showPublishModal && <PublishModal close={() => setShowPublishModal(false)} />}
    </>
  );
};

NoteMenu.propTypes = {
  toggleFS: PropTypes.func.isRequired,
  isFS: PropTypes.bool.isRequired,
  trashNote: PropTypes.func.isRequired,
  trashShown: PropTypes.bool.isRequired,
  restoreNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  noteID: PropTypes.string,
  showList: PropTypes.func.isRequired,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired,
  isPinned: PropTypes.bool.isRequired,
  isCollab: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFS: state.ui.isFullscreen,
  trashShown: state.notes.trashShown,
  noteID: state.notes.currentNoteID,
  isPinned: selectNoteIsPinned(state, state.notes.currentNoteID),
  isCollab: selectIsCollab(state)
});

const mapDispatchToProps = dispatch => ({
  toggleFS: () => dispatch(toggleFullscreen()),
  trashNote: () => dispatch(trashNote()),
  restoreNote: () => dispatch(restoreNote()),
  deleteNote: () => dispatch(deleteNote()),
  showList: () => dispatch(setListShown(true)),
  pinNote: noteID => dispatch(pinNote(noteID)),
  unpinNote: noteID => dispatch(unpinNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteMenu));
