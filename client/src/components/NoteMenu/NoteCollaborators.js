import React from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import Avatar from '../UI/Avatar/Avatar';
import { selectCurrCollabs } from '../../store/selectors';

const NoteCollaborators = ({ collabs, byName }) => (
  <div className="NoteMenu__collabs">
    {collabs.map(username => {
      const user = byName[username];
      return (
        <Avatar
          key={username}
          color={user.color || '#ddd'}
          username={username}
          status={
            user.isActive ? 'Active' :
            user.isOnline ? 'Inactive' :
            'Offline'
          }
        />
      );
    })}
  </div>
);

NoteCollaborators.propTypes = {
  collabs: PropTypes.array.isRequired,
  byName: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  collabs: selectCurrCollabs(state),
  byName: state.collabs
});

export default connect(mapStateToProps)(NoteCollaborators);
