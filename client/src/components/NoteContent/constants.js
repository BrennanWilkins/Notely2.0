export const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const MARK_HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
};

export const BLOCK_HOTKEYS = {
  'mod+shift+1': 'heading-one',
  'mod+shift+2': 'heading-two',
  'mod+shift+3': 'block-quote',
  'mod+shift+4': 'numbered-list',
  'mod+shift+5': 'bulleted-list',
  'mod+shift+6': 'check-list-item'
};

export const OP_TYPES = {
  'insert_text': true,
  'remove_text': true,
  'insert_node': true,
  'merge_node': true,
  'move_node': true,
  'remove_node': true,
  'set_node': true,
  'split_node': true,
  'set_selection': false,
  'set_value': false
};
