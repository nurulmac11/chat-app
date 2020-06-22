import React from 'react';
import {Admin, Resource, ShowGuesser, ListGuesser, fetchUtils} from 'react-admin';
import crudProvider from '@fusionworks/ra-data-nest-crud';
import {GuestCreate, GuestEdit} from './Users';
import authProvider from './authProvider';

const fetchJson = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Authorization: 'Bearer ' + localStorage.accessToken });
    }
    options.headers.set('Authorization', 'Bearer ' + localStorage.accessToken);
    return fetchUtils.fetchJson(url, options);
}

const dataProvider = crudProvider('http://localhost:3000', fetchJson);

const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="admin" list={ListGuesser} create={GuestCreate} edit={GuestEdit} show={ShowGuesser}/>
    </Admin>
);

export default App;
