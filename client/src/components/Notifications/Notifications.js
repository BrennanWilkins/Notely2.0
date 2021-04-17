import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { getSocket } from '../../socket';
import { xIcon } from '../UI/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('note error', error => {
      setNotifs(notifs => [...notifs, error]);
      // remove error notification after 4 sec
      setTimeout(() => {
        setNotifs(notifs => notifs.filter(n => n.msgID !== error.msgID));
      }, 4500);
    });
  }, []);

  const deleteHandler = id => {
    setNotifs(notifs.filter(n => n.msgID !== id));
  };

  return (
    <TransitionGroup className="Notifications">
      {notifs.map(({ msgID, msg }) => (
        <CSSTransition key={msgID} timeout={350} classNames="Notifications__notif">
          <div className="Notifications__notif">
            <div className="Notifications__msg">{msg}</div>
            <div className="Notifications__btn" onClick={() => deleteHandler(msgID)}>
              {xIcon}
            </div>
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default Notifications;
