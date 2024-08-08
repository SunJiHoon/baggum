import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types'
import config from '../config/dev'; // config.js 파일의 경로가 현재 파일 기준으로 맞는지 확인하세요

export function loginUser(dataToSubmit){
    console.log(dataToSubmit)

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.post(`${config.baseUrl}/api/users/login`, dataToSubmit, { withCredentials: true })
    .then(response =>  response.data )

    return{
        type: LOGIN_USER,
        payload: request,
    }

}

export function registerUser(dataToSubmit){
    console.log(dataToSubmit)

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.post(`${config.baseUrl}/api/users/register`, dataToSubmit, { withCredentials: true })
    .then(response =>  response.data )

    return{
        type: REGISTER_USER,
        payload: request,
    }

}

export function auth(){
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const request = axios.get(`${config.baseUrl}/api/users/auth`, { withCredentials: true })
    .then(response => response.data)

    return{
        type: AUTH_USER,
        payload: request,
    }
}