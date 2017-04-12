/* global React:true */

class SearchResultItem extends React.Component {
    render() {
        return (
            <div className="quests__item">
                {this.props.children}
            </div>
        );
    }
}

export default SearchResultItem;
