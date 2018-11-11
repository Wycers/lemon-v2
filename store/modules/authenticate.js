import http from '../../utils/http'
import md5 from 'md5'

export default {
  namespaced: true,
  // State
  state: {
    nickname: null,
    avatar: null,
    token: null
  },
  // Mutations
  mutations: {
    SET_USER(state, user) {
      if (user === null) {
        state.nickname = null
        state.avatar = null
        state.token = null
      } else {
        state.nickname = user.nickname
        state.avatar = user.avatar
        state.token = user.token
      }
    }
  },
  // Actions
  actions: {
    async signin({ commit }, { username, password }) {
      try {
        const res = await http.post('/u/signin', {
          username: username,
          password: md5(password)
        })
        if (res.data.success === true) {
          commit('SET_USER', res.data.user)
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
        const res = await http.post('/u/signout', { token: state.token })
        if (res.data.success === true) {
          commit('SET_USER', null)
        } else {
          throw new Error(res.data.data)
        }
      } catch (error) {
        throw error
      }
    }
  }
}
