import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types'
export function loginUser(dataToSubmit){
    console.log(dataToSubmit)

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.post(`${baseUrl}/api/users/login`, dataToSubmit, { withCredentials: true })
    .then(response =>  response.data )

    return{
        type: LOGIN_USER,
        payload: request,
    }

}

export function registerUser(dataToSubmit){
    console.log(dataToSubmit)

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.post(`${baseUrl}/api/users/register`, dataToSubmit, { withCredentials: true })
    .then(response =>  response.data )

    return{
        type: REGISTER_USER,
        payload: request,
    }

}

export function auth(){
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.get(`${baseUrl}/api/users/auth`, { withCredentials: true })
    .then(response => response.data)

    return{
        type: AUTH_USER,
        payload: request,
    }
}