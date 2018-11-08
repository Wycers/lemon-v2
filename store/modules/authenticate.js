import axios from 'axios'
import md5 from 'md5'

export default {
  namespaced: true,
  // State
  state: {
    nickname: '',
    avatar: '',
    token: ''
  },
  // Mutations
  mutations: {
    SET_USER(state, user) {
      state.nickname = user.nickname
      state.avatar = user.avatar
      state.token = user.token
    }
  },
  // Actions
  actions: {
    async signin({ commit }, { username, password }) {
      try {
        const res = await axios.post('/api/u/signin', {
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
        const res = await axios.post('/api/u/signup', {
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
        console.log(error)
        throw error
      }
    }
  }
}
