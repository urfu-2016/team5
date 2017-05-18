import React from 'react';
import ImagesCountControl from './../../ImagesCountControl/ImagesCountControl';
import DropDownButton from './../../DropDownButton/DropDownButton';
import './SearchBarParams.css';
import Item from './Item';
import b from 'b_';

function itemWithDropDownButton(className, param, params) {
    return (
        <Item className={className} title={param.title}>
            <DropDownButton options={param.options}
                    value={params[param.name]}
                    name={param.name}
            />
        </Item>);
}

export default class SearchBarParams extends React.Component {
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
            to: params[imagesCount.name.to],
            max: 15,
            min: 1
        };

        return (
            <div className={b('container', {hidden: !this.props.showParams})}>
                <div className={b('searchbar', 'params-group', {hidden: !this.props.showParams})}>
                    <Item className={b('param-item', {n: 1})} title={imagesCount.title}>
                        <ImagesCountControl value={imagesCountValue} name={imagesCount.name} />
                    </Item>
                    {itemWithDropDownButton(b('param-item', {n: 2}), searchCity, params)}
                    {itemWithDropDownButton(b('param-item', {n: 3}), likesCount, params)}
                    {itemWithDropDownButton(b('param-item', {n: 4}), reviewsCount, params)}
                    {itemWithDropDownButton(b('param-item', {n: 5}), searchByField, params)}
                </div>
            </div>);
    }
}
