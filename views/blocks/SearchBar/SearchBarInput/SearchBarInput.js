/* global React:true */

import './SearchBarInput.css';
const SearchBarInputPlaceholder = 'Введите данные';
const FindString = 'Найти';

class SearchBarInput extends React.Component {
    render() {
        const {searchString, onShowParams} = this.props;
        return (
            <div className="searchbar__input-group">
                <input className="searchbar__input" type="search" name="searchString"
                    placeholder={SearchBarInputPlaceholder} value={searchString}>
                </input>
                <input type="button" className="searchbar__btn-params" value="&#9776;"
                    onClick={onShowParams}></input>
                <button className="searchbar__btn-submit"
                    type="submit" name="search-btn">{FindString}</button>
            </div>);
    }
}

export default SearchBarInput;
