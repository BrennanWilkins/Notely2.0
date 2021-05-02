import React, { useMemo } from 'react';
import './NoteListNote.css';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { showNote, pinNote, unpinNote } from '../../store/actions';
import { pinIcon } from '../UI/icons';
import { selectNoteIsPinned } from '../../store/selectors';
import { serializeBody } from '../../utils/slateHelpers';

const NoteListNote = props => {
  const { title, subTitle } = useMemo(() => {
    return serializeBody(props.body);
  }, [props.body]);

  const pinHandler = () => {
    props.isPinned ? props.unpinNote() : props.pinNote();
  };

  return (
    <div
      className={`
        NoteListNote
        ${props.isCurrent ? 'NoteListNote--active' : ''}
        NoteListNote--${props.display}
      `}
      onClick={props.showNote}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          props.showNote();
        }
      }}
      tabIndex="0"
    >
      {!props.trashShown &&
        <span
          className={`NoteListNote__pin ${props.isPinned ? 'NoteListNote__pin--hl' : ''}`}
          onClick={pinHandler}
        >
          {pinIcon}
        </span>
      }
      {(props.searchQuery && title) ?
        <>
          <Highlighter
            className="NoteListNote__title"
            highlightClassName="NoteListNote__txt--hl"
            searchWords={[props.searchQuery]}
            textToHighlight={title}
          />
          {!!subTitle && props.display !== 'Condensed' &&
            <Highlighter
              className="NoteListNote__txt"
              highlightClassName="NoteListNote__txt--hl"
              searchWords={[props.searchQuery]}
              textToHighlight={subTitle}
            />
          }
        </>
        :
        <>
          <div className="NoteListNote__title">
            {title || 'New Note'}
          </div>
          {props.display !== 'Condensed' &&
            <div className="NoteListNote__txt">
              {subTitle}
            </div>
          }
        </>
      }
    </div>
  );
};

NoteListNote.propTypes = {
  searchQuery: PropTypes.string,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired,
  showNote: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  noteID: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  trashShown: PropTypes.bool.isRequired,
  display: PropTypes.string.isRequired,
  body: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  searchQuery: state.notes.searchQuery,
  isCurrent: state.notes.currentNoteID === ownProps.noteID,
  trashShown: state.notes.trashShown,
  display: state.ui.noteListDisplay,
  isPinned: selectNoteIsPinned(state, ownProps.noteID),
  body: state.notes.notesByID[ownProps.noteID].body
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  showNote: () => dispatch(showNote(ownProps.noteID)),
  pinNote: () => dispatch(pinNote(ownProps.noteID)),
  unpinNote: () => dispatch(unpinNote(ownProps.noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteListNote);
