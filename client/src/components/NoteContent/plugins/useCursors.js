import React, { useState, useCallback } from 'react';
import { Text, Range, Path } from 'slate';
import '../NoteContent.css';

const useCursors = () => {
  const [cursors, setCursors] = useState(new Map());

  const cursorHandler = useCallback(data => {
    const { username, op, noteID, color } = data;
    if (!username || !op || !color || op.type !== 'set_selection') { return; }

    if (!op.newProperties) {
      return removeCursor(username);
    }

    const { focus, anchor } = op.newProperties;

    if (focus && anchor) {
      setCursors(c => new Map(c).set(username, {
        username,
        color,
        alphaColor: color.slice(0, -2) + '0.2)',
        isForward: Range.isForward(op.newProperties),
        focus,
        anchor
      }));
    } else if (!anchor && focus) {
      setCursors(c => {
        if (c.has(username)) {
          const old = c.get(username);
          return new Map(c).set(username, {
            ...old,
            focus,
            isForward: Range.isForward({ anchor: old.anchor, focus })
          });
        }
        return c;
      });
    }
  }, []);

  const removeCursor = useCallback(username => {
    setCursors(c => {
      if (c.has(username)) {
        const updatedCursors = new Map(c);
        updatedCursors.delete(username);
        return updatedCursors;
      }
      return c;
    });
  }, []);

  const decorate = useCallback(([node, path]) => {
    if (!Text.isText(node) || !cursors.size) { return []; }

    const ranges = [];
    cursors.forEach((cursor, username) => {
      const { focus, anchor, isForward } = cursor;
      if (!Range.includes({ focus, anchor }, path)) { return; }
      const isFocusNode = Path.equals(focus.path, path);
      const isAnchorNode = Path.equals(anchor.path, path);

      ranges.push({
        ...cursor,
        isCaret: isFocusNode,
        anchor: {
          path,
          offset: isAnchorNode ? anchor.offset : isForward ? 0 : node.text.length
        },
        focus: {
          path,
          offset: isFocusNode ? focus.offset : isForward ? node.text.length : 0
        }
      });
    });

    return ranges;
  }, [cursors]);

  const resetCursors = () => setCursors(new Map());

  return { decorate, cursorHandler, removeCursor, resetCursors };
};

export const Caret = ({ color, isForward, username }) => {
  const cursorStyles = {
    background: color,
    left: isForward ? '100%' : '0%'
  };
  const caretStyles = {
    background: color,
    left: isForward ? '100%' : '0%'
  };

  caretStyles[isForward ? 'bottom' : 'top'] = 0;

  return (
    <>
      <span contentEditable={false} style={caretStyles} className="NoteContent__caret">
        <span style={{ position: 'relative' }}>
          <span contentEditable={false} style={cursorStyles} className="NoteContent__cursor">
            {username}
          </span>
        </span>
      </span>
    </>
  );
};

export default useCursors;
