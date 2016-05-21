'use strict';

import * as types from './actionTypes';


function authSuccess(authorized) {
    return {
        type: types.AUTHORIZE_SUCCESS,
        authorized: authorized
    }
}

function authFailed(authorized) {
    return {
        type: types.AUTHORIZE_FAILED,
        authorized: authorized
    }
}

export function authorize() {
    dispatch(authSuccess(true));
}