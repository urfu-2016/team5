import React from 'react';
import './SearchBarInput.css';
import b from 'b_';
const SearchBarInputPlaceholder = 'Введите данные';
const FindString = 'Найти';

export default class SearchBarInput extends React.Component {
    render() {
        const {searchString, onShowParams} = this.props;
        return (
            <div className={b('searchbar', 'input-group')}>
                <input className={b('searchbar', 'input')} type="search" name="searchString"
                    placeholder={SearchBarInputPlaceholder} value={searchString}>
                </input>
                <input type="button" className={`button ${b('searchbar', 'button', {type: 'parameters'})}`}
                    value="&#9776;" onClick={onShowParams}>
                </input>
                <button className={`button ${b('searchbar', 'button', {type: 'submit'})}`}
                    type="submit" name="search-btn">
                    {FindString}
                </button>
            </div>);
    }
}
