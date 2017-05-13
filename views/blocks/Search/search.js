import React from 'react';
import SearchBar from './../SearchBar/SearchBar';
import SearchResult from './../SearchResult/SearchResult';
import SearchResultItem from './../SearchResult/ResultItem';
import Card from './../QuestCard/questCard';
import constants from './../../constants/defaultStates';

const Searcher = require('./Searcher.js');

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.handleResultChange = this.handleResultChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.search = this.search.bind(this);

        this.state = constants.defaultState;
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
