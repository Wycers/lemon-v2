<template lang="pug">
v-dialog(value="true", max-width="290", persistent='')
  v-card(hover='', style='background:white')
    v-card-title.black--text.cyan.darken-1
        div(style="font-size: x-large",class="text-xs-center")  {{"Login" }}
    v-card-text.pt-4
      v-form(
        ref="form"
        v-model="valid"
        lazy-validation
      )
      v-text-field(
        v-model="username"
        :rules="usernameRules"
        label="username"
        required
      )
      v-text-field(
        v-model="password"
        :rules="passwordRules"
        label="password"
        type="password"
        required
      )
      v-btn(
        :disabled="!valid"
        @click="onSubmit"
      ) submit
</template>

<script>
import axios from 'axios'
export default {
  layout: 'login',
  data() {
    return {
      valid: true,
      username: '',
      password: '',
      usernameRules: [
        v => !!v || 'Username is required'
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ]
    }
  },
  methods: {
    onSuccess(data) {
      // this.$store.commit('setAuth', data)
    },
    get_cookie(Name) {
      var search = Name + '=' //查询检索的值
      var returnvalue = '' //返回值
      if (document.cookie.length > 0) {
        var sd = document.cookie.indexOf(search)
        if (sd != -1) {
          sd += search.length
          var end = document.cookie.indexOf(';', sd)
          if (end == -1) end = document.cookie.length
          //unescape() 函数可对通过 escape() 编码的字符串进行解码。
          returnvalue = unescape(document.cookie.substring(sd, end))
        }
      }
      return returnvalue
    },
    onSubmit() {
      console.log(233)
      console.log(this.get_cookie('csrf'))
      axios.post('/api/u/login', {
        username: this.username,
        password: this.password,
        _csrf: this.get_cookie('csrf')
      })
      // this.$store.commit('login')
      this.$router.replace('/')
    }
  }
}
</script>
