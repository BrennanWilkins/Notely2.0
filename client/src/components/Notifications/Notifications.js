import React from 'react';
import './Notifications.css';
import PropTypes from 'prop-types';
import { xIcon } from '../UI/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { deleteNotif } from '../../store/actions';

const Notifications = props => (
  <TransitionGroup className="Notifications">
    {props.notifs.map(({ msgID, msg }) => (
      <CSSTransition key={msgID} timeout={350} classNames="Notifications__notif">
        <div className="Notifications__notif">
          <div className="Notifications__msg">{msg}</div>
          <div className="Notifications__btn" onClick={() => props.deleteNotif(msgID)}>
            {xIcon}
          </div>
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
);

Notifications.propTypes = {
  notifs: PropTypes.array.isRequired,
  deleteNotif: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notifs: state.notifs
});

const mapDispatchToProps = dispatch => ({
  deleteNotif: msgID => dispatch(deleteNotif(msgID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
