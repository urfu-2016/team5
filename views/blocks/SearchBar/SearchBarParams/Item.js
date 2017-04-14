/* global React:true */

import './Item.css';

class Item extends React.Component {
    render() {
        const {title, className, children} = this.props;
        return (
            <div className={`item ${className}`}>
                <span className="item__title">{title}</span>
                {children}
            </div>);
    }
}

export default Item;
