/* global React:true */

class SearchPaginationControl extends React.Component {
    constructor(props) {
        super(props);
        this.handlePage = this.handlePage.bind(this);
    }

    handlePage(e) {
        var page = e.target.dataset.page;
        if (this.props.onChangePage) {
            this.props.onChangePage(page);
        }
    }

    render() {
        var page = this.props.currentPage;
        var maxPage = this.props.pageCount;
        var isLastPage = page === maxPage;
        var isFirstPage = page === 1;

        return (
            <div className="pagination" onClick={this.handlePage}>
                {(maxPage > 3 && page > 2) &&
                    <button className="pagination__item pagination__item_start" data-page={1}>В начало</button> }
                {(maxPage > 2 && isLastPage) &&
                    <button className="pagination__item" data-page={page - 2}>{page - 2}</button>}
                {page > 1 &&
                    <button className="pagination__item" data-page={page - 1}>{page - 1}</button>}
                <span className="pagination__item pagination__item_active">{page}</span>
                {page < maxPage &&
                    <button className="btn-right" data-page={page + 1}>{page + 1}</button>}
                {(maxPage > 2 & isFirstPage) &&
                    <button className="pagination__item" data-page={page + 2}>{page + 2}</button>}
                {(maxPage > 3 && page < maxPage - 1) &&
                    <button className="pagination__item pager__item_end" data-page={maxPage}>В конец</button> }
            </div>
        );
    }
}

export default SearchPaginationControl;
