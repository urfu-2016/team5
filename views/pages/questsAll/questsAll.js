import React from 'react';
import ReactDOM from 'react-dom';
import Search from '../../blocks/Search/search';

ReactDOM.render(
    <div className="container">
        <h2 className="page__title">Все квесты</h2>
        <Search />
    </div>,
    document.getElementById('root')
);
