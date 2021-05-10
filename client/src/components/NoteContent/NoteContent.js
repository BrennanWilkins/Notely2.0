import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import './NoteContent.css';
import PropTypes from 'prop-types';
import { withReact, Slate } from 'slate-react';
import { Editor, createEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import Toolbar from './Toolbar';
import { connect } from 'react-redux';
import { updateNote, setStatus } from '../../store/actions';
import { logo } from '../UI/icons';
import { sendUpdate } from '../../socket';
import NoteEditor from './NoteEditor';
import { OP_TYPES } from './constants';
import withChecklists from './plugins/withChecklists';
import useCursors from './plugins/useCursors';
import withLinks from './plugins/withLinks';
import useSearch from './plugins/useSearch';
import { selectIsCollab, selectCurrBody } from '../../store/selectors';

const NoteContent = ({
  body,
  searchQuery,
  noteID,
  isCollab,
  setStatus,
  updateNote
}) => {
  const [value, setValue] = useState(body);
  const editor = useMemo(() => withLinks(withChecklists(withHistory(withReact(createEditor())))), []);
  const status = useRef({
    isRemoteChange: false,
    hasChanged: false,
    wasRemote: false,
    oldSection: null,
    prevNoteID: null
  });
  const { decorate: cursorDecorate, cursorHandler, removeCursor, resetCursors } = useCursors();
  const { decorate: searchDecorate } = useSearch(searchQuery);

  const decorate = useCallback((...args) => {
    return [...cursorDecorate(...args), ...searchDecorate(...args)];
  }, [cursorDecorate, searchDecorate]);

  useEffect(() => {
    setValue(body);
    resetCursors();
    // reset history
    editor.history = {
      redos: [],
      undos: []
    };

    // leaving editor, notify collabs user is leaving
    if (!noteID && status.current.prevNoteID) {
      const socket = sendUpdate('leave editor');
      socket.off('receive ops');
      socket.off('receive cursor');
      status.current.prevNoteID = null;
      return;
    }

    const socket = sendUpdate('join editor', noteID);
    status.current.prevNoteID = noteID;

    socket.on('receive ops', data => {
      if (
        data.noteID !== noteID
        || !data.ops
        || !Array.isArray(data.ops)
      ) {
        return;
      }

      status.current.isRemoteChange = true;
      // prevent normalizing to stop split_node bug
      // uses withoutSaving to not populate user's history with other users
      Editor.withoutNormalizing(editor, () => {
        HistoryEditor.withoutSaving(editor, () => {
          data.ops.forEach(op => {
            if (!OP_TYPES[op.type]) { return; }
            editor.apply(op);
          });
        });
      });
      status.current.isRemoteChange = false;
      status.current.hasChanged = true;
      status.current.wasRemote = true;
    });

    socket.on('receive cursor', data => {
      if (!data.noteID || data.noteID !== noteID) { return; }
      cursorHandler(data);
    });

    socket.on('user inactive', data => removeCursor(data.username));
    socket.on('user offline', data => removeCursor(data.username));
  }, [noteID]);

  useEffect(() => {
    if (
      !noteID
      || value === body
      || status.current.isRemoteChange
      || status.current.hasChanged
    ) {
      return;
    }
    if (status.current.wasRemote) {
      return status.current.wasRemote = false;
    }

    updateNote(noteID, value);
    setStatus(false);
    // save changes to DB 700ms after stop typing
    const delay = setTimeout(() => {
      if (!noteID || status.current.isRemoteChange || status.current.wasRemote) {
        return setStatus(true);
      }
      sendUpdate('put/note/save', { noteID, body: value }, () => {
        setStatus(true);
      });
    }, 700);

    return () => {
      if (status.current.prevNoteID === noteID) {
        clearTimeout(delay);
      }
    };
  }, [value]);

  const changeHandler = val => {
    setValue(val);
    const ops = editor.operations;
    if (
      noteID
      && ops.length
      && !status.current.isRemoteChange
      && !status.current.hasChanged
    ) {
      const sendOps = ops.filter(op => op && OP_TYPES[op.type]);
      if (sendOps.length) {
        sendUpdate('send ops', { noteID, ops: sendOps });
      }
    }
    if (isCollab && noteID && status.current.oldSelection !== editor.selection) {
      sendUpdate('send cursor', { noteID, selection: editor.selection });
    }
    status.current.hasChanged = false;
    status.current.oldSelection = editor.selection;
  };

  return (
    noteID ?
      <div className="NoteContent">
        <Slate editor={editor} value={value} onChange={changeHandler}>
          <Toolbar />
          <NoteEditor editor={editor} decorate={decorate} />
        </Slate>
      </div>
    :
      <div className="NoteContent NoteContent--empty">
        <div className="NoteContent__logo">{logo}</div>
      </div>
  );
};

NoteContent.propTypes = {
  body: PropTypes.array.isRequired,
  noteID: PropTypes.string,
  updateNote: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  isCollab: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string
};

const mapStateToProps = state => ({
  noteID: state.notes.currentNoteID,
  body: selectCurrBody(state),
  isCollab: selectIsCollab(state),
  searchQuery: state.notes.searchQuery
});

const mapDispatchToProps = dispatch => ({
  updateNote: (noteID, body) => dispatch(updateNote(noteID, body)),
  setStatus: bool => dispatch(setStatus(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteContent));
