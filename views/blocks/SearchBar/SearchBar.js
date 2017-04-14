/* global React:true */

import './SearchBar.css';
import SearchBarInput from './SearchBarInput/SearchBarInput';
import SearchBarParams from './SearchBarParams/SearchBarParams';

const SBParams = require('./params');

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleShowParams = this.handleShowParams.bind(this);

        this.state = {
            showParams: false
        };
    }

    handleShowParams(e) {
        e.preventDefault();
        this.setState({
            showParams: !this.state.showParams
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit();
    }

    handleInputChange(e) {
        var target = e.target;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        var name = target.name;
        this.props.onInputChange(name, value);
    }

    render() {
        return (
            <form className="searchbar"
                onSubmit={this.handleSubmit}
                onChange={this.handleInputChange}>
                <SearchBarInput
                    searchString={this.props.params.searchString}
                    onShowParams={this.handleShowParams}/>
                <SearchBarParams
                    showParams={this.state.showParams}
                    params={this.props.params}
                    {...SBParams.params}/>
            </form>
        );
    }
}
