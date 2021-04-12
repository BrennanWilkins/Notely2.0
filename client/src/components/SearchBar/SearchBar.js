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

  const clickHandler = () => {
    if (!props.sideNavShown) {
      props.toggleSideNav();
      setTimeout(() => inputRef.current.focus(), 250);
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    props.setSearchQuery('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      props.setSearchQuery(searchVal);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    setSearchVal(props.searchQuery);
  }, [props.searchQuery]);

  return (
    <div
      className={`SearchBar ${props.sideNavShown ? '' : 'SearchBar--contract'}`}
      onClick={clickHandler}
    >
      <div className="SearchBar__icon">{searchIcon}</div>
      <input
        ref={inputRef}
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        className="SearchBar__input"
        placeholder="Search Notes"
      />
      <div
        className={`SearchBar__clear ${searchVal ? 'SearchBar__clear--active' : ''}`}
        onClick={clearSearch}
      >
        {xIcon}
      </div>
      {!props.sideNavShown && <Tooltip position="right">Search</Tooltip>}
    </div>
  );
};

SearchBar.propTypes = {
  sideNavShown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  searchQuery: state.notes.searchQuery
});

const mapDispatchToProps = dispatch => ({
  setSearchQuery: query => dispatch(setSearchQuery(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
