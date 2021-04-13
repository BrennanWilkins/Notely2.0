import React from 'react';
import { useReadOnly, ReactEditor, useSlate } from 'slate-react';
import { Editor, Point, Range, Transforms, Element as SlateElement } from 'slate';

const withChecklists = editor => {
  const { deleteBackward } = editor;
  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === 'check-list-item'
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties = { type: 'paragraph', checked: null };
          Transforms.setNodes(editor, newProperties, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'check-list-item'
          })
          return;
        }
      }
    }
    deleteBackward(...args);
  }

  return editor;
};

export const ChecklistItem = ({ attributes, children, element }) => {
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

export default withChecklists;
