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

export const notesContent = [
  {
    q: `Do I need to save my changes?`,
    a: `No, all of your notes are automatically saved to the cloud.`
  },
  {
    q: `How do I recover a note that I accidentally deleted?`,
    a: `Click on the Trash section in the menu, and then find the note and click on 'Restore' at the top right.`
  },
  {
    q: `Is there a limit to the number of notes I can create?`,
    a: `No, at this time there is no limit.`
  },
  {
    q: `Is there a max note character length?`,
    a: `No, there is no character limit to a note, however, it is better to split up a very large note
    into several notes to prevent any lag while editing.`
  },
  {
    q: `How do I pin notes?`,
    a: `To pin notes, click on the pin icon either at the top right or the icon when you hover over a note in the note list.`
  },
  {
    q: `How do tags work?`,
    a: `Tags allow you to group notes together. You can view the notes with a certain by clicking on the tag name in the menu.
    You can add a tag and view a note's tags below the note editor.`
  },
  {
    q: `How does search work?`,
    a: `When you search for a keyword or phrase in the search bar, a list of notes that match that search query will be shown.
    If you want to search notes with a certain tag, click on that tag in the menu before searching.`
  },
  {
    q: 'How do I copy a note?',
    a: `To copy a note, click on the note options button at the top right and click on 'Copy Note'.`
  },
  {
    q: 'How do I sort my notes?',
    a: 'To sort your notes, click on the sort button at the top of the note list.'
  }
];

export const pubContent = [
  {
    q: `How does publishing work?`,
    a: `Publishing allows you to share your note with anyone. When you publish a note, a unique link is generated for your note.
    You can share this link with anyone to allow them to view your note.`
  },
  {
    q: `Can other people edit my note if it's published?`,
    a: `No, you must be logged in as a collaborator of the note to edit it.`
  }
];

export const collabContent = [
  {
    q: `How does collaborating work?`,
    a: `Collaborating allows you to edit a note with other users in real-time. You will be able to see each other's edits and cursors when
    you are editing on the same note.`
  },
  {
    q: `How do I add a collaborator?`,
    a: `To add a collaborator, click on the share icon at the top right, and either enter the email or username of another Notely user.`
  },
  {
    q: `How do I join a note to collaborate on it?`,
    a: `You can view your note collaboration invitations by clicking on 'Invites' in the menu. You will see a list of your invites if you have any, where
    you will be able to preview the note content, reject the invite, or accept it.`
  },
  {
    q: `What does status and the orange icon mean next to the collaborator's name?`,
    a: `When a user is online, a random color is generated to allow you to distinguish the different collaborator's cursors in the note editor.
    When a collaborator is online but working on a different note, their status will show inactive, and a orange icon will appear next to their name.
    If a user is offline, their name will be grayed out.`
  },
  {
    q: 'How do I remove a collaborator from a note?',
    a: `If you are the original creator of the note, you can remove any of the note's collaborators by click on the share icon and clicking on 'Remove'
     next to the user.`
  }
];

export const accntContent = [
  {
    q: `How do I change my password?`,
    a: `You can change your password by clicking on 'Change my password' in the Account menu.`
  },
  {
    q: `Can I change my username?`,
    a: `At this time you cannot change your username.`
  },
  {
    q: `How do I delete my account?`,
    a: `You can delete your account by clicking on 'Delete my account' in the Account menu. If you are currently collaborating on any notes, those notes that
    you are collaborating on will not be deleted, and you will only be removed as a collaborator.`
  }
];

export const settingsContent = [
  {
    q: `How do I turn on dark mode?`,
    a: `You can toggle dark mode on or off by clicking on 'Settings' in the menu, and clicking on the button at the top of the window.`
  },
  {
    q: `Can I customize the note editor's settings?`,
    a: `Yes, you can change the margins or the font size of the note editor by clicking on 'Settings' in the menu.`
  },
  {
    q: `How do I export my notes?`,
    a: `You can export your notes to a text file by clicking on 'Settings' in the menu and then clicking on 'Export Notes'.`
  }
];
