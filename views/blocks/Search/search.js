/* global React:true */

import SearchBar from './../SearchBar/SearchBar';
import SearchResult from './../SearchResult/SearchResult';
import SearchResultItem from './../SearchResult/ResultItem';
import Card from './../QuestCard/questCard';

const SearchFunctionality = require('./searchFunctionality.js');

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.handleResultChange = this.handleResultChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.search = this.search.bind(this);

        this.state = {
            result: [],
            searchString: '',
            likesCount: 0,
            reviewsCount: 0,
            searchCity: 0,
            searchByField: 0,
            imagesCount: 0,
            currentPage: 1,
            pageCount: 1
        };
    }

    componentDidMount() {
        this.search(this.state.currentPage);
    }

    handleSubmit() {
        this.search(1);
    }

    search(newPageNumber) {
        var params = {
            searchString: this.state.searchString
        };

        SearchFunctionality.search(params, newPageNumber)
            .then(function (response) {
                return response.json();
            })
            .then(this.handleResultChange);
    }

    handleResultChange(data) {
        this.setState({
            result: data.quests,
            currentPage: data.pageNumber,
            countPage: data.maxPageNumber
        });
    }

    handleInputChange(name, value) {
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="Search">
                <SearchBar handleSubmit={this.handleSubmit}
                    onInputChange={this.handleInputChange} params={this.state}/>
                {this.state.result.length > 0 ? (
                    <SearchResult currentPage={this.state.currentPage}
                        pageCount={this.state.pageCount} handleChangePage={this.search}>
                        {this.state.result.map(card =>
                            <SearchResultItem key={card.slug.toString()}>
                                <Card card={card} />
                            </SearchResultItem>)}
                    </SearchResult>
                ) : (
                    <div>Таких квестов нет :(</div>)}
            </div>
        );
    }
}

export default Search;
