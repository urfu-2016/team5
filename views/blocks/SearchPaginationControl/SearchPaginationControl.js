import React from 'react';
import './SearchPaginationControl.css';
import b from 'b_';
const startString = 'В начало';
const endString = 'В конец';

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
            <div className={b('pagination')} onClick={this.handlePage}>
                {(pageCount > 3 && currentPage > 2) &&
                    <button className={b('pagination', 'item', {type: 'start'})} data-page={1}>{startString}</button>}
                {(pageCount > 2 && isLastPage) &&
                    <button className={b('pagination', 'item')} data-page={currentPage - 2}>{currentPage - 2}</button>}
                {currentPage > 1 &&
                    <button className= {b('pagination', 'item')} data-page={currentPage - 1}>{currentPage - 1}</button>}
                <span className= {b('pagination', 'item', {active: true})}>{currentPage}</span>
                {currentPage < pageCount &&
                    <button className= {b('pagination', 'item')} data-page={currentPage + 1}>{currentPage + 1}</button>}
                {(pageCount > 2 && isFirstPage) &&
                    <button className= {b('pagination', 'item')} data-page={currentPage + 2}>{currentPage + 2}</button>}
                {(pageCount > 3 && currentPage < pageCount - 1) &&
                    <button className= {b('pagination', 'item', {type: 'end'})} data-page={pageCount}>{endString}</button> }
            </div>
        );
    }
}
