/* global React:true */

import './SearchResult.css';
import SearchPageControl from './../SearchPageControl/SearchPageControl';

class SearchResult extends React.Component {
    render() {
        return (
            <div>
                <div className="SearchResult quests">
                    {this.props.children}
                </div>
                <SearchPageControl
                        onChangePage={this.props.handleChangePage}
                        currentPage={this.props.currentPage}
                        countPage={this.props.countPage}/>
            </div>
        );
    }
}

export default SearchResult;
