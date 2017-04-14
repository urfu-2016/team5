/* global React:true */

export default class SearchPaginationControl extends React.Component {
    constructor(props) {
        super(props);
        this.handlePage = this.handlePage.bind(this);
    }

    handlePage(e) {
        var page = e.target.dataset.page;
        if (this.props.onPageChange) {
            this.props.onPageChange(page);
        }
    }

    render() {
        var {currentPage, pageCount} = this.props;
        var isLastPage = currentPage === pageCount;
        var isFirstPage = currentPage === 1;

        return (
            <div className="pagination" onClick={this.handlePage}>
                {(pageCount > 3 && currentPage > 2) &&
                    <button className="pagination__item pagination__item_start" data-page={1}>В начало</button>}
                {(pageCount > 2 && isLastPage) &&
                    <button className="pagination__item" data-page={currentPage - 2}>{currentPage - 2}</button>}
                {currentPage > 1 &&
                    <button className="pagination__item" data-page={currentPage - 1}>{currentPage - 1}</button>}
                <span className="pagination__item pagination__item_active">{currentPage}</span>
                {currentPage < pageCount &&
                    <button className="btn-right" data-page={currentPage + 1}>{currentPage + 1}</button>}
                {(pageCount > 2 && isFirstPage) &&
                    <button className="pagination__item" data-page={currentPage + 2}>{currentPage + 2}</button>}
                {(pageCount > 3 && currentPage < pageCount - 1) &&
                    <button className="pagination__item pager__item_end" data-page={pageCount}>В конец</button> }
            </div>
        );
    }
}
