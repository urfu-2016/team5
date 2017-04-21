import React from 'react';
import './ResultItem.css';
import b from 'b_';

export default class SearchResultItem extends React.Component {
    render() {
        return (
            <div className={b('quests', 'item')}>
                {this.props.children}
            </div>
        );
    }
}
