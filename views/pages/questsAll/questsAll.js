import React from 'react';
import './questAll.css';
import ReactDOM from 'react-dom';
import Search from '../../blocks/Search/search';

ReactDOM.render(
    <div className="search-page">
        <h2 className="page__title">Все квесты</h2>
        <Search />
    </div>,
    document.getElementById('root')
);
