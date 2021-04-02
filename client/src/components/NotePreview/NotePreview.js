import React, { useState, useMemo, useEffect } from 'react';
import { createEditor, Descendant, Element } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import './NotePreview.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { sendUpdate } from '../../socket';

const NotePreview = props => {
  const [value, setValue] = useState([]);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    const socket = sendUpdate('get/note/invite', { noteID: props.noteID });

    socket.on('success: get/note/invite', data => {
      socket.off('success: get/note/invite');
      const { body } = JSON.parse(data);
      setValue(body);
    });
  }, [props.noteID]);

  return (
    <div className="NotePreview">
      <CloseBtn className="NotePreview__closeBtn" onClick={props.close} />
      <div className="NotePreview__slate">
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
          <Editable readOnly placeholder="Empty Note" />
        </Slate>
      </div>
    </div>
  );
};

NotePreview.propTypes = {
  close: PropTypes.func.isRequired,
  noteID: PropTypes.string.isRequired
};

export default NotePreview;
