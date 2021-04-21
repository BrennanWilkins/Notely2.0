import isMac from '../../utils/isMac';

export const generalShortcuts = [
  { name: 'Toggle Menu', sc: ['Alt', 'Shift', 'M'] },
  { name: 'New Note', sc: ['Alt', 'Shift', 'N'] },
  { name: 'Toggle Fullscreen', sc: ['Alt', 'Shift', 'F'] },
  { name: 'Open Note List', sc: ['Alt', 'Shift', 'B'] }
];

const ctrlKey = isMac ? 'Cmd' : 'Ctrl';

export const editorShortcuts = [
  { name: 'Bold', sc: [ctrlKey, 'B'] },
  { name: 'Italics', sc: [ctrlKey, 'I'] },
  { name: 'Underline', sc: [ctrlKey, 'U'] },
  { name: 'Code Block', sc: [ctrlKey, '`'] },
  { name: 'Heading 1', sc: [ctrlKey, 'Shift', '1'] },
  { name: 'Heading 2', sc: [ctrlKey, 'Shift', '2'] },
  { name: 'Block Quote', sc: [ctrlKey, 'Shift', '3'] },
  { name: 'Numbered List', sc: [ctrlKey, 'Shift', '4'] },
  { name: 'Bulleted List', sc: [ctrlKey, 'Shift', '5'] },
  { name: 'Checkbox', sc: [ctrlKey, 'Shift', '6'] },
  { name: 'Insert Link', sc: [ctrlKey, 'Shift', '7'] },
];
