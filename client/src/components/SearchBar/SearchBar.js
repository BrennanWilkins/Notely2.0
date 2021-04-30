import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';
import { searchIcon, xIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { connect } from 'react-redux';
import { setSearchQuery } from '../../store/actions';

const SearchBar = props => {
  const [searchVal, setSearchVal] = useState('');
  const inputRef = useRef();
  const valRef = useRef('');

  const clickHandler = () => {
    if (!props.isExpanded) {
      props.toggleSideNav();
      setTimeout(() => inputRef.current.focus(), 250);
    }
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter' && !props.isExpanded) {
      clickHandler();
      e.currentTarget.blur();
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    props.setSearchQuery('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (valRef.current === searchVal) { return; }
      props.setSearchQuery(searchVal);
      valRef.current = searchVal;
    }, 400);

    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    setSearchVal(props.searchQuery);
  }, [props.searchQuery]);

  return (
    <div
      className={`SearchBar ${props.isExpanded ? '' : 'SearchBar--contract'}`}
      onClick={clickHandler}
      tabIndex={props.isExpanded ? '-1' : '0'}
      onKeyPress={keyPressHandler}
    >
      <div className="SearchBar__icon">{searchIcon}</div>
      <input
        ref={inputRef}
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        className="SearchBar__input"
        placeholder={props.shownTag ? `Search in ${props.shownTag}` : 'Search Notes'}
      />
      <div
        className={`SearchBar__clear ${searchVal ? 'SearchBar__clear--active' : ''}`}
        onClick={clearSearch}
      >
        {xIcon}
      </div>
      {!props.isExpanded && <Tooltip position="right">Search</Tooltip>}
    </div>
  );
};

SearchBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  shownTag: PropTypes.string
};

const mapStateToProps = state => ({
  searchQuery: state.notes.searchQuery,
  shownTag: state.notes.shownTag
});

const mapDispatchToProps = dispatch => ({
  setSearchQuery: query => dispatch(setSearchQuery(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
