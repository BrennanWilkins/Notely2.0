import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import { arrowRepeatIcon, checkIcon } from '../UI/icons';
import { selectCurrUpdatedAt } from '../../store/selectors';
import LiveDate from '../UI/LiveDate';

const NoteStatus = ({ updatedAt, changesSaved }) => {
  return (
    <div className="NoteMenu__info">
      <div className="NoteMenu__date">
        <LiveDate date={updatedAt} prefix="Last updated" />
      </div>
      <div className={`NoteMenu__status ${!changesSaved ? 'NoteMenu__status--anim' : ''}`}>
        {
          changesSaved ?
          <>{checkIcon}All changes saved</> :
          <>{arrowRepeatIcon}Saving changes</>
        }
      </div>
    </div>
  );
};

NoteStatus.propTypes = {
  updatedAt: PropTypes.string.isRequired,
  changesSaved: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  updatedAt: selectCurrUpdatedAt(state),
  changesSaved: state.notes.changesSaved
});

export default connect(mapStateToProps)(React.memo(NoteStatus));
