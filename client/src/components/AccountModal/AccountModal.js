import React, { useState } from 'react';
import './AccountModal.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackBtn } from '../UI/Buttons/Buttons';
import { logout } from '../../store/actions';
import ChangePass from './ChangePass';
import DeleteAccnt from './DeleteAccnt';
import ModalContainer from '../UI/ModalContainer/ModalContainer';

const AccountModal = ({ close, email, username, logout }) => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteAccnt, setShowDeleteAccnt] = useState(false);

  const backHandler = () => {
    setShowChangePass(false);
    setShowDeleteAccnt(false);
  };

  return (
    <ModalContainer
      close={close}
      title={showChangePass ? 'Change my password' : showDeleteAccnt ? 'Delete my account' : 'Account'}
    >
      {(showChangePass || showDeleteAccnt) && <BackBtn onClick={backHandler} />}
      {
        showChangePass ?
          <ChangePass />
        :
        showDeleteAccnt ?
          <DeleteAccnt logout={logout} />
        :
          <>
            <div className="AccountModal__subTitle">Username</div>
            <div className="AccountModal__info">{username}</div>
            <div className="AccountModal__subTitle">Email</div>
            <div className="AccountModal__info">{email}</div>
            <button
              className="Btn BlueBtn AccountModal__logoutBtn"
              onClick={logout}
            >
              Log Out
            </button>
            <div
              className="AccountModal__btn"
              onClick={() => setShowChangePass(true)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setShowChangePass(true);
                }
              }}
              tabIndex="0"
            >
              Change my password
            </div>
            <div
              className="AccountModal__btn"
              onClick={() => setShowDeleteAccnt(true)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setShowDeleteAccnt(true);
                }
              }}
              tabIndex="0"
            >
              Delete my account
            </div>
          </>
      }
    </ModalContainer>
  );
};

AccountModal.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);
