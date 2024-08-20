import { SET_USER_ENDPOINT, IS_LOGGEDIN_ENDPOINT, LOGIN_USER_ENDPOINT, LOGOUT_ENDPOINT } from "../constants/apiUrls";

export const loginUser = async (userData) => {
    const response = await fetch(LOGIN_USER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const statusCode = response.status;

    if(!response.ok){
        if(statusCode === 401){
            throw new Error('Invalid credentials.');
        } else {
            throw new Error('Failed to connect.')
        }
    }

    const data = await response.json();
    return data;
}

export const registerUser = async (userData) => {
    const response = await fetch(SET_USER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const statusCode = response.status;

    if(!response.ok){
        if(statusCode === 409){
            throw new Error('User already exists. Try another one.');
        } else if (statusCode === 400) {
            throw new Error('Unexpected error. Try again later.');
        } else {
            throw new Error('Failed to connect');
        }
    }

    const data = await response.json();
    return data;
}

export const isLoggedIn = async () => {
    const response = await fetch(IS_LOGGEDIN_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const statusCode = response.status;

    if(!response.ok){
        if(statusCode === 401){
            throw new Error('Not logged in.');
        } else {
            throw new Error('Unexpected error. Try again later.');
        }
    }

    const data = await response.json();
    return data;
} 

export const logout = async () => {
    const response = await fetch(LOGOUT_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!response.ok){
        throw new Error('Unexpected error when logout. Try again later.');
    }

    const data = await response.json();
    return data;
}