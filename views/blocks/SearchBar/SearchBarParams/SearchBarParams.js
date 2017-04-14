/* global React:true */

import DropDownButton from './../../DropDownButton/DropDownButton';
import Item from './Item';
import ImagesCountControl from './../../ImagesCountControl/ImagesCountControl';
import './SearchBarParams.css';

function itemWithDropDownButton(className, param, params) {
    return (
        <Item className={className} title={param.title}>
            <DropDownButton options={param.options}
                    value={params[param.name]}
                    name={param.name}/>
        </Item>);
}

class SearchBarParams extends React.Component {
    render() {
        const {
            imagesCount,
            searchCity,
            likesCount,
            reviewsCount,
            searchByField,
            params} = this.props;

        const imagesCountValue = {
            from: params[imagesCount.name.from],
            to: params[imagesCount.name.to]};

        return (
            <div className={'conteiner ' + (this.props.showParams ? '' : 'conteiner_hidden')}>
                <div className={'searchbar__params-group ' + (this.props.showParams ? '' : 'params-group_hidden')}>
                    <Item className="param-item param-item_n1" title={imagesCount.title}>
                        <ImagesCountControl value={imagesCountValue} name={imagesCount.name} />
                    </Item>
                    {itemWithDropDownButton('param-item param-item_n2', searchCity, params)}
                    {itemWithDropDownButton('param-item param-item_n3', likesCount, params)}
                    {itemWithDropDownButton('param-item param-item_n4', reviewsCount, params)}
                    {itemWithDropDownButton('param-item param-item_n5', searchByField, params)}
                </div>
            </div>);
    }
}

export default SearchBarParams;
