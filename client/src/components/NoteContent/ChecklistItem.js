import React from 'react';
import { useReadOnly, ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';

const ChecklistItemElement = ({ attributes, children, element }) => {
  const editor = useSlate();
  const readOnly = useReadOnly();
  const { checked } = element;

  const changeHandler = e => {
    const path = ReactEditor.findPath(editor, element);
    const newProperties = { checked: e.target.checked };
    Transforms.setNodes(editor, newProperties, { at: path });
  };

  return (
    <div {...attributes} className="NoteContent__checkbox">
      <span contentEditable={false} style={{ marginRight: '0.75em' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={changeHandler}
        />
      </span>
      <span
        style={{
          flex: '1',
          opacity: checked ? '0.666' : 1,
          textDecoration: checked ? 'line-through' : 'none',
          outline: 'none'
        }}
        contentEditable={!readOnly}
        suppressContentEditableWarning
      >
        {children}
      </span>
    </div>
  );
};

export default ChecklistItemElement;
