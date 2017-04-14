/* global React:true */

export default class SearchResultItem extends React.Component {
    render() {
        return (
            <div className="quests__item">
                {this.props.children}
            </div>
        );
    }
}
