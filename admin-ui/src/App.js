import React from 'react';
import {Admin, Resource, ShowGuesser, ListGuesser} from 'react-admin';
import crudProvider from '@fusionworks/ra-data-nest-crud';
import {GuestCreate, GuestEdit} from './Users';
import authProvider from './authProvider';

const dataProvider = crudProvider('http://localhost:3000');

const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="admin" list={ListGuesser} create={GuestCreate} edit={GuestEdit} show={ShowGuesser}/>
    </Admin>
);

export default App;
