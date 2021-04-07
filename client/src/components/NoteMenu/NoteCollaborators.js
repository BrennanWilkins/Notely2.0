import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import Avatar from '../UI/Avatar/Avatar';

const NoteCollaborators = props => {
  return (
    <div className="NoteMenu__collabs">
      {props.users.map(user => (
        <Avatar color="#ddd" username={user.username} status="Offline" />
      ))}
    </div>
  );
};

NoteCollaborators.propTypes = {
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  users: state.notes.notesByID[state.notes.currentNoteID].collaborators
});

export default connect(mapStateToProps)(NoteCollaborators);
