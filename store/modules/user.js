import http from '~/utils/http'
import md5 from 'md5'

export default {
  namespaced: true,
  // State
  state: {
    token: null,

    nickname: null,
    avatar: null,
    email: null,
    locale: null
  },
  // Mutations
  mutations: {
    SET_USER(state, { token }) {
      console.log(token)
      if (token) {
        state.token = token
        localStorage.setItem('token', state.token)
      } else {
        const fields = 'nickname,avatar,email,locale,token'.split(',')
        fields.forEach(field => {
          state[field] = null
        })
        localStorage.removeItem('token')
      }
    },
    SET_STATUS(state, data) {
      const fields = 'nickname,avatar,email,locale'.split(',')
      if (data) {
        fields.forEach(field => {
          if (data[field]) {
            state[field] = data[field]
          }
        })
      }
    }
  },
  // Actions
  actions: {
    async signin({ commit, dispatch }, { username, password }) {
      try {
        const res = await http.post('/u/signin', {
          username: username,
          password: md5(password)
        })
        if (res.data.success === true) {
          await commit('SET_USER', res.data.user)
          await dispatch('fetchProfile')
        } else {
          throw new Error(res.data.data)
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async signup({ commit }, { username, password, inviteCode }) {
      try {
        const res = await http.post('/u/signup', {
          username: username,
          password: md5(password),
          ic: inviteCode
        })
        if (res.data.success === true) {
          commit('SET_USER', res.data.user)
        } else {
          throw new Error(res.data.data)
        }
      } catch (error) {
        throw error
      }
    },
    async signout({ state, commit }) {
      try {
        const res = await http.post('/u/signout')
        if (res.data.success === true) {
          commit('SET_USER', {})
        } else {
          throw new Error(res.data.data)
        }
      } catch (error) {
        throw error
      }
    },
    async fetchProfile({ commit }) {
      try {
        const res = await http.get('/profile')
        commit('SET_STATUS', res.data)
      } catch (error) {
        commit('SET_USER', {})
        console.log('qwq')
      }
    }
  }
}
