import React from 'react';
import './NoteMenu.css';
import PropTypes from 'prop-types';
import { expandIcon, contractIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleFullscreen } from '../../store/actions';
import Tooltip from '../UI/Tooltip/Tooltip';

const NoteMenu = props => {
  return (
    <div className="NoteMenu">
      <div className="NoteMenu__btns">
        <button className="NoteMenu__fsBtn" onClick={props.toggleFullscreen}>
          {props.isFullscreen ? contractIcon : expandIcon}
          <Tooltip position="down">Fullscreen<div>Ctrl+Shift+F</div></Tooltip>
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NoteMenu);
