import React, { useMemo, useState, useEffect, useRef } from 'react';
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

const NoteContent = props => {
  const [value, setValue] = useState(props.body);
  const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), []);
  const isRemoteChange = useRef(false);
  const hasChanged = useRef(false);
  const wasRemote = useRef(false);
  const prevNoteID = useRef(null);
  const { decorate, cursorHandler, removeCursor, resetCursors } = useCursors();
  const oldSelection = useRef(null);

  useEffect(() => {
    setValue(props.body);
    resetCursors();
    // reset history
    editor.history = {
      redos: [],
      undos: []
    };

    // leaving editor, notify collabs user is leaving
    if (!props.noteID && prevNoteID.current) {
      const socket = sendUpdate('leave editor');
      socket.off('receive ops');
      socket.off('receive cursor');
      prevNoteID.current = null;
      return;
    }

    const socket = sendUpdate('join editor', props.noteID);
    prevNoteID.current = props.noteID;

    socket.on('receive ops', data => {
      if (data.noteID !== props.noteID || !data.ops
        || !Array.isArray(data.ops)) { return; }
      isRemoteChange.current = true;
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
      isRemoteChange.current = false;
      hasChanged.current = true;
      wasRemote.current = true;
    });

    socket.on('receive cursor', data => {
      if (!data.noteID || data.noteID !== props.noteID) { return; }
      cursorHandler(data);
    });

    socket.on('user inactive', data => removeCursor(data.username));
    socket.on('user offline', data => removeCursor(data.username));
  }, [props.noteID]);

  useEffect(() => {
    if (!props.noteID || value === props.body ||
      isRemoteChange.current || hasChanged.current) { return; }
    if (wasRemote.current) {
      return wasRemote.current = false;
    }
    props.updateNote(props.noteID, value);
    props.setStatus();
    // save changes to DB 700ms after stop typing
    const delay = setTimeout(() => {
      if (!props.noteID || isRemoteChange.current) { return; }
      sendUpdate('put/note/save', { noteID: props.noteID, body: value });
    }, 700);

    return () => clearTimeout(delay);
  }, [value]);

  const changeHandler = val => {
    setValue(val);
    const ops = editor.operations;
    if (props.isCollab && props.noteID && ops.length && !isRemoteChange.current && !hasChanged.current) {
      const sendOps = ops.filter(op => op && OP_TYPES[op.type]);
      if (sendOps.length) {
        sendUpdate('send ops', { noteID: props.noteID, ops: sendOps });
      }
    }
    if (props.isCollab && props.noteID && oldSelection.current !== editor.selection) {
      sendUpdate('send cursor', { noteID: props.noteID, selection: editor.selection });
    }
    hasChanged.current = false;
    oldSelection.current = editor.selection;
  };

  return (
    props.noteID ?
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
  isCollab: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  noteID: state.notes.currentNoteID,
  body: state.notes.currentNoteID ? state.notes.notesByID[state.notes.currentNoteID].body : [],
  isCollab: !state.notes.currentNoteID ? false : state.notes.notesByID[state.notes.currentNoteID].collaborators.length > 1
});

const mapDispatchToProps = dispatch => ({
  updateNote: (noteID, body) => dispatch(updateNote(noteID, body)),
  setStatus: () => dispatch(setStatus(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteContent));
