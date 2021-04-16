import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { getSocket } from '../../socket';
import { xIcon } from '../UI/icons';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('note error', error => {
      setNotifs(notifs => [...notifs, error]);
      // remove error notification after 4 sec
      setTimeout(() => {
        setNotifs(notifs => notifs.filter(n => n.msgID !== error.msgID));
      }, 4000);
    });
  }, []);

  const deleteHandler = id => {
    setNotifs(notifs.filter(n => n.msgID !== id));
  };

  return (
    <div className="Notifications">
      {notifs.map(({ msgID, msg }) => (
        <div className="Notifications__notif" key={msgID}>
          <div className="Notifications__msg">{msg}</div>
          <div className="Notifications__btn" onClick={() => deleteHandler(msgID)}>
            {xIcon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
