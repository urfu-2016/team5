/* global React:true */

import './SearchBarInput.css';

class SearchBarInput extends React.Component {
    render() {
        return (
            <div className="searchbar__input-group">
                <input className="searchbar__input"
                    type="search" name="searchString"
                    placeholder="Введите данные"
                    value={this.props.searchString}>
                </input>
                <button className="searchbar__btn-params"
                    onClick={this.props.onShowParams}>&#127860;</button>
                <button className="searchbar__btn-submit"
                    type="submit" name="search-btn">Найти</button>
            </div>);
    }
}

export default SearchBarInput;
