import axios, { type AxiosStatic } from 'axios';

declare global {
    interface Window {
        axios: AxiosStatic;
    }
}

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
