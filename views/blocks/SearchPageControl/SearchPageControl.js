/* global React:true */

class SearchPageControl extends React.Component {
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
        var maxPage = this.props.countPage;

        return (
            <div className="pager" onClick={this.handlePage}>
                {(maxPage > 3 && page > 2) &&
                    <button className="pager__item pager__item_start"
                        data-page={1}>В начало</button> }
                {(page === maxPage && maxPage > 2) &&
                    <button className="pager__item pager__item_activ"
                        data-page={page - 2}>{page - 2}</button>}
                {page > 1 &&
                    <button className="pager__item pager__item_activ"
                        data-page={page - 1}>{page - 1}</button>}
                <span className="pager__item pager__item_activ">{page}</span>
                {page < maxPage &&
                    <button className="btn-right"
                        data-page={page + 1}>{page + 1}</button>}
                {(page === 1 && maxPage > 2) &&
                    <button className="pager__item pager__item_activ"
                        data-page={page + 2}>{page + 2}</button>}
                {(maxPage > 3 && page < maxPage - 1) &&
                    <button className="pager__item pager__item_end"
                        data-page={maxPage}>В конец</button> }
            </div>
        );
    }
}

export default SearchPageControl;
