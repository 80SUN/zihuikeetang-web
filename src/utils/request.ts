import axios from 'axios';
import { Message } from '@arco-design/web-vue';

// Create Axios Instance
const service = axios.create({
    baseURL: 'http://localhost:8080', // Backend Gateway Port
    timeout: 5000 // Timeout
});

// Request Interceptor
service.interceptors.request.use(
    config => {
        // Add Token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response Interceptor
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            Message.error(res.message || 'Error');
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res.data;
        }
    },
    error => {
        console.error('err' + error);
        Message.error(error.message || 'Request Error');
        return Promise.reject(error);
    }
);

export default service;