import React, { useState } from 'react';
import './SettingsModal.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackBtn } from '../UI/Buttons/Buttons';
import { logout } from '../../store/actions';
import ChangePass from './ChangePass';
import DeleteAccnt from './DeleteAccnt';
import ModalContainer from '../UI/ModalContainer/ModalContainer';

const SettingsModal = props => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteAccnt, setShowDeleteAccnt] = useState(false);

  const backHandler = () => {
    setShowChangePass(false);
    setShowDeleteAccnt(false);
  };

  return (
    <ModalContainer close={props.close} title={showChangePass ? 'Change my password' : showDeleteAccnt ? 'Delete my account' : 'Settings'}>
      {(showChangePass || showDeleteAccnt) && <BackBtn onClick={backHandler} />}
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
    </ModalContainer>
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
