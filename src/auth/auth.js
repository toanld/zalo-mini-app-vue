import bearer from '@websanova/vue-auth/dist/v3/vue-auth';
import axios from '@websanova/vue-auth/dist/drivers/http/axios.1.x';
import router from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x';

const config = {
    auth: bearer,
    http: axios,
    router: router,
    tokenDefaultName: 'auth-token',
    tokenStore: ['cookie'],
    notFoundRedirect: {
        path: '/home'
    },
    registerData: {
        url: '/api/auth/register',
        method: 'POST',
        redirect: null,
    },
    loginData: {
        url: '/api/auth/login',
        method: 'POST',
        redirect: '/home',
        fetchUser: true,
    },
    logoutData: {
        url: '/api/auth/logout',
        method: 'POST',
        redirect: '/login',
        makeRequest: true
    },
    fetchData: {
        url: '/api/auth/user',
        method: 'GET',
        enabled: true
    },
    parseUserData (data) {
        return data || {}
    },
};

export default config;