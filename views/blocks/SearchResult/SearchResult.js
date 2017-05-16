import React from 'react';
import SearchPaginationControl from './../SearchPaginationControl/SearchPaginationControl';
import './SearchResult.css';
import b from 'b_';

export default class SearchResult extends React.Component {
    render() {
        const {onPageChange, currentPage, pageCount, children} = this.props;
        return (
            <div className="container-r">
                <div className={`quests-r ${b('search', 'result')}`} >
                    {children}
                </div>
                <SearchPaginationControl
                    onPageChange={onPageChange}
                    currentPage={Number(currentPage)}
                    pageCount={Number(pageCount)}
                />
            </div>
        );
    }
}
