import React from 'react';
import SearchBar from './../SearchBar/SearchBar';
import SearchResult from './../SearchResult/SearchResult';
import SearchResultItem from './../SearchResult/ResultItem';
import Card from './../QuestCard/questCard';
import constants from './../../constants/defaultStates';

const Searcher = require('./Searcher.js');

function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[[]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results || !results[2]) {
        return null;
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function modifySearchState(state) {
    const searchType = getParameterByName('type');

    if (searchType === 'tag') {
        state.searchByField = 'tags';
        state.searchString = getParameterByName('tag');
    } else if (searchType === 'string') {
        state.searchString = getParameterByName('string');
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.handleResultChange = this.handleResultChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.search = this.search.bind(this);

        let state = constants.defaultState;

        if (getParameterByName('type')) {
            modifySearchState(state);
        }

        this.state = state;
    }

    componentDidMount() {
        this.search(this.state.currentPage);
    }

    handleSubmit() {
        this.search(1);
        this.setState({
            loading: true
        });
    }

    search(newPageNumber) {
        var params = Searcher.getSearchParameters(this.state, newPageNumber);

        Searcher.searchRequest(params)
            .then(function (response) {
                return response.json();
            })
            .then(this.handleResultChange)
            .catch(() => {});
    }

    handleResultChange(data) {
        this.setState({
            result: data.quests,
            currentPage: data.pageNumber,
            pageCount: data.maxPageNumber,
            loading: false
        });
    }

    handleInputChange(name, value) {
        this.setState({
            [name]: value
        });
    }

    renderResult() {
        return (
            <SearchResult currentPage={this.state.currentPage}
                pageCount={this.state.pageCount} onPageChange={this.search}>
                {this.state.result.map(card =>
                    <SearchResultItem key={card.slug.toString()}>
                        <Card card={card} />
                    </SearchResultItem>)}
            </SearchResult>);
    }

    render() {
        return (
            <div className="Search">
                <SearchBar handleSubmit={this.handleSubmit}
                    onInputChange={this.handleInputChange} params={this.state}/>
                {(this.state.result.length > 0) ?
                    this.renderResult() :
                    !this.state.loading && <div>Таких квестов нет :(</div>}
            </div>
        );
    }
}

export default Search;
