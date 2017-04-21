import React from 'react';
import b from 'b_';
import './Item.css';

export default class Item extends React.Component {
    render() {
        const {title, className, children} = this.props;
        return (
            <div className={`item ${className}`}>
                <span className={b('item', 'title')}>{title}</span>
                {children}
            </div>);
    }
}
