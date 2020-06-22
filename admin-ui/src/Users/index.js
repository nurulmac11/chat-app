import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    Edit,
    required,
    email,
} from 'react-admin';

const validateEmail = [required(), email()];
const validateRequired = required();
export const GuestCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="show">
            <TextInput source="username" validate={validateRequired}/>
            <TextInput source="anonymousName" validate={validateRequired}/>
            <TextInput source="email" validate={validateEmail}/>
        </SimpleForm>
    </Create>
);
const GuestEditTitle = ({record}) => (<span>{`${record.username} ${record.email}`}</span>);
export const GuestEdit = props => (
    <Edit {...props} title={<GuestEditTitle/>}>
        <SimpleForm redirect="list">
            <TextInput source="username" validate={validateRequired}/>
            <TextInput source="anonymousName" validate={validateRequired}/>
            <TextInput source="email" validate={validateEmail}/>
            <BooleanInput source="isActive"/>
            <BooleanInput source="isOnline"/>
        </SimpleForm>
    </Edit>
);
