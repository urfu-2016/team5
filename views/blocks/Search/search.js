/* global React:true */

import SearchBar from './../SearchBar/SearchBar';
import SearchResult from './../SearchResult/SearchResult';
import SearchResultItem from './../SearchResult/ResultItem';
import Card from './../QuestCard/questCard';

const SearchLog = require('./searchLog.js');

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.handleResultChange = this.handleResultChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.searchF = this.searchF.bind(this);

        this.state = {
            result: [],
            searchString: '',
            likesCount: 0,
            reviewsCount: 0,
            searchCity: 0,
            searchByField: 0,
            imagesCount: 0,
            currentPage: 1,
            countPage: 1
        };
    }

    componentDidMount() {
        this.searchF(this.state.currentPage);
    }

    handleSubmit() {
        this.searchF(1);
    }

    searchF(newPage) {
        var params = {
            searchString: this.state.searchString
        };

        SearchLog.search(params, newPage)
            .then(function (response) {
                return response.json();
            })
            .then(this.handleResultChange);
    }

    handleResultChange(data) {
        this.setState({
            result: data.quests,
            currentPage: data.page,
            countPage: data.maxPage
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
                <SearchBar
                    handleSubmit={this.handleSubmit}
                    onInputChange={this.handleInputChange}
                    params={this.state}/>
                {this.state.result.length > 0 ? (
                    <SearchResult
                        currentPage={this.state.currentPage}
                        countPage={this.state.countPage}
                        handleChangePage={this.searchF}>
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
