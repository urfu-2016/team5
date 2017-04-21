import React from 'react';
import './SearchBarInput.css';
import b from 'b_';
import {SearchBarInputString} from './../../../constants/strings';

export default class SearchBarInput extends React.Component {
    render() {
        const {searchString, onShowParams} = this.props;
        return (
            <div className={b('searchbar', 'input-group')}>
                <input className={b('searchbar', 'input')} type="search" name="searchString"
                    placeholder={SearchBarInputString.placeholder} value={searchString}>
                </input>
                <input type="button" className={`button ${b('searchbar', 'button', {type: 'parameters'})}`}
                    value="&#9776;" onClick={onShowParams}>
                </input>
                <button className={`button ${b('searchbar', 'button', {type: 'submit'})}`}
                    type="submit" name="search-btn">
                    {SearchBarInputString.find}
                </button>
            </div>);
    }
}
