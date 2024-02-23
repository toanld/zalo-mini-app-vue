import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

axios.defaults.baseURL = 'http://app-backend.test/api'

export default new Vuex.Store({
    state: {
        user: null
    },

    mutations: {
        setUserData (state, userData) {
            state.user = userData
            localStorage.setItem('user', JSON.stringify(userData))
            axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`
        },

        clearUserData () {
            localStorage.removeItem('user')
            location.reload()
        }
    },

    actions: {
        login ({ commit }, credentials) {
            return axios
                .post('/login', credentials)
                .then(({ data }) => {
                    commit('setUserData', data)
                })
        },

        logout ({ commit }) {
            commit('clearUserData')
        }
    },

    getters: {
        isLogged: state => !!state.user
    }
})
