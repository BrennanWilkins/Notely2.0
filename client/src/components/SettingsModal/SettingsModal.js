import React, { useRef, useState } from 'react';
import './SettingsModal.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { xIcon, backIcon } from '../UI/icons';
import { logout } from '../../store/actions';
import ChangePass from './ChangePass';
import DeleteAccnt from './DeleteAccnt';

const SettingsModal = props => {
  const modalRef = useRef();
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteAccnt, setShowDeleteAccnt] = useState(false);

  const clickHandler = e => {
    if (modalRef.current.contains(e.target)) { return; }
    props.close();
  };

  const backHandler = () => {
    setShowChangePass(false);
    setShowDeleteAccnt(false);
  };

  return (
    <div className="SettingsContainer" onClick={clickHandler}>
      <div className="SettingsModal" ref={modalRef}>
        <div className="SettingsModal__title">{showChangePass ? 'Change my password' : showDeleteAccnt ? 'Delete my account' : 'Settings'}</div>
        <div className="SettingsModal__closeBtn" onClick={props.close}>{xIcon}</div>
        {(showChangePass || showDeleteAccnt) && <div className="SettingsModal__backBtn" onClick={backHandler}>{backIcon}</div>}
        {
          showChangePass ?
            <ChangePass />
          :
          showDeleteAccnt ?
            <DeleteAccnt logout={props.logout} />
          :
            <>
              <div className="SettingsModal__subTitle">Username</div>
              <div className="SettingsModal__info">{props.username}</div>
              <div className="SettingsModal__subTitle">Email</div>
              <div className="SettingsModal__info">{props.email}</div>
              <button className="SettingsModal__logoutBtn" onClick={props.logout}>Log Out</button>
              <div className="SettingsModal__btn" onClick={() => setShowChangePass(true)}>Change my password</div>
              <div className="SettingsModal__btn" onClick={() => setShowDeleteAccnt(true)}>Delete my account</div>
            </>
        }
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  close: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  email: state.user.email,
  username: state.user.username
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
