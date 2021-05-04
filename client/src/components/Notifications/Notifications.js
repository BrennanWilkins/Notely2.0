import React from 'react';
import { createPortal } from 'react-dom';
import './Notifications.css';
import PropTypes from 'prop-types';
import { xIcon } from '../UI/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { deleteNotif } from '../../store/actions';

const Notifications = ({ notifs, deleteNotif }) => (
  createPortal(
    <TransitionGroup className="Notifications">
      {notifs.map(({ msgID, msg }) => (
        <CSSTransition key={msgID} timeout={350} classNames="Notifications__notif">
          <div
            className="Notifications__notif"
            style={msgID === 'reconnect' ? { background: '#0a9f10' } : null}
          >
            <div className="Notifications__msg">{msg}</div>
            <div className="Notifications__btn" onClick={() => deleteNotif(msgID)}>
              {xIcon}
            </div>
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>,
    document.getElementById('portal-root')
  )
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
