import axios from 'axios';
import config from '../../config/dev'

const api = axios.create({
    baseURL: `${config.baseUrl}/api/users`,
    withCredentials: true,
})

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if(parts.length === 2) return parts.pop().split(';').shift();
    return null
}


api.interceptors.request.use(
    async(config_data)=>{
        try{

        //제외할 페이지 추가
            if(
                config_data.url.includes('/login') ||
                config_data.url.includes('/register') ||
                config_data.url.includes('/logout') ||
                config_data.url.includes('/auth')
            ){
                return config_data;
            }
            const access_token = getCookie('x_auth');
            if(access_token){
                config_data.headers['Authorization'] = `Bearer ${access_token}`;
            }
            return config_data;
        }
        catch(err){
            return Promise.reject(err);
        }
    }
);
//####################################
// Refresh_Token으로 갱신하는 것부터 시작
//####################################

api.interceptors.response.use(
    (response)=>{
        return response;
    },
    async (err)=>{
        const originalRequest = err.config;
        if(err.response && err.response.status === 403 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                //refresh 토큰으로 새로운 access 토큰 발급 받는 요청
                const response = await api.get('/auth');
                return api(originalRequest);
            }
            catch(err){
                console.error('토큰 갱신 실패', err);
                
                return Promise.reject(err);
            }
        }

        return Promise.reject(err);
    }
);


export default {api, getCookie};