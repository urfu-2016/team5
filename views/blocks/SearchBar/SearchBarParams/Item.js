/* global React:true */

import './Item.css';

class Item extends React.Component {
    render() {
        return (
            <div className="params-item">
                <span className="params-item__title">
                    {this.props.title}
                </span>
                <div className="params-item__input">
                    {this.props.children}
                </div>
            </div>);
    }
}

export default Item;
