/* global React:true */

import './SearchResult.css';
import SearchPaginationControl from './../SearchPaginationControl/SearchPaginationControl';

class SearchResult extends React.Component {
    render() {
        return (
            <div>
                <div className="search-result quests">
                    {this.props.children}
                </div>
                <SearchPaginationControl
                    onChangePage={this.props.handleChangePage}
                    currentPage={this.props.currentPage}
                    pageCount={this.props.pageCount}/>
            </div>
        );
    }
}

export default SearchResult;
