/* global React:true */

import './SearchResult.css';
import SearchPaginationControl from './../SearchPaginationControl/SearchPaginationControl';

export default class SearchResult extends React.Component {
    render() {
        const {onPageChange, currentPage, pageCount, children} = this.props;
        return (
            <div>
                <div className="search-result quests">
                    {children}
                </div>
                <SearchPaginationControl
                    onPageChange={onPageChange}
                    currentPage={currentPage}
                    pageCount={pageCount}/>
            </div>
        );
    }
}
