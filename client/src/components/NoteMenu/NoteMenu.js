import React from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { expandIcon, contractIcon, trashIcon, shareIcon, pinIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleFullscreen } from '../../store/actions';
import Tooltip from '../UI/Tooltip/Tooltip';

const NoteMenu = props => {
  return (
    <div className="NoteMenu">
      <div className="NoteMenu__btns">
        <button className="NoteMenu__btn" onClick={props.toggleFullscreen}>
          {props.isFullscreen ? contractIcon : expandIcon}
          <Tooltip position="down">Fullscreen<div>Ctrl+Shift+F</div></Tooltip>
        </button>
        <div className="NoteMenu__options">
          <button className="NoteMenu__optionBtn">
            {pinIcon}
            <Tooltip position="down">Pin to top</Tooltip>
          </button>
          <button className="NoteMenu__optionBtn">
            {shareIcon}
            <Tooltip position="down">Share</Tooltip>
          </button>
          <button className="NoteMenu__optionBtn">
            {trashIcon}
            <Tooltip position="down">Send to trash</Tooltip>
          </button>
        </div>
      </div>
    </div>
  );
};

NoteMenu.propTypes = {
  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen
});

const mapDispatchToProps = dispatch => ({
  toggleFullscreen: () => dispatch(toggleFullscreen())
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteMenu));
