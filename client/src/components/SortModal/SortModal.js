import React, { useRef } from 'react';
import './SortModal.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { useModalToggle } from '../../utils/customHooks';
import { connect } from 'react-redux';
import { setSortType } from '../../store/actions';
import { sortTypes } from '../../utils/sortTypes';

const SortModal = ({ close, sortType, setSortType }) => {
  const modalRef = useRef();
  useModalToggle(modalRef, close);

  return (
    <div className="SortModal" ref={modalRef}>
      <div className="SortModal__title">
        Sort By
        <CloseBtn className="SortModal__closeBtn" onClick={close} />
      </div>
      <div className="SortModal__options">
        {sortTypes.map(({ type, val }) => (
          <div
            key={type}
            className={sortType === type ? 'SortModal__activeOption' : ''}
            onClick={() => setSortType(type)}
            tabIndex="0"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                setSortType(type);
              }
            }}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

SortModal.propTypes = {
  close: PropTypes.func.isRequired,
  sortType: PropTypes.string.isRequired,
  setSortType: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  sortType: state.notes.sortType
});

const mapDispatchToProps = dispatch => ({
  setSortType: sortType => dispatch(setSortType(sortType))
});

export default connect(mapStateToProps, mapDispatchToProps)(SortModal);
