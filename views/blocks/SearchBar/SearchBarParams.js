/* global React:true */

import DropDownBtn from './../DropDownBtn/DropDownBtn';
import Item from './Item';

class SearchBarParams extends React.Component {
    render() {
        return (
            <div className={'searchbar__params-group ' + (this.props.showParams ? '' : 'params-group_hidden')}>
                <Item title={this.props.searchCity.title}>
                    <DropDownBtn options={this.props.searchCity.options}
                        value={this.props.params[this.props.searchCity.name]}
                        name={this.props.searchCity.name}/>
                </Item>
                <Item title={this.props.imagesCount.title}>
                    <input value={this.props[this.props.imagesCount.name]}></input>
                </Item>
                <Item title={this.props.likesCount.title}>
                    <DropDownBtn options={this.props.likesCount.options}
                        value={this.props.params[this.props.likesCount.name]}
                        name={this.props.likesCount.name}/>
                </Item>
                <Item title={this.props.reviewsCount.title}>
                    <DropDownBtn options={this.props.reviewsCount.options}
                        value={this.props.params[this.props.reviewsCount.name]}
                        name={this.props.reviewsCount.name}/>
                </Item>
                <Item title={this.props.searchByField.title}>
                    <DropDownBtn options={this.props.searchByField.options}
                        value={this.props.params[this.props.searchByField.name]}
                        name={this.props.searchByField.name}/>
                </Item>
            </div>);
    }
}

export default SearchBarParams;
