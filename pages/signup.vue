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
          @focus="usernameOnFocus"
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
        v-text-field(
          v-model="rpassword"
          :rules="rpasswordRules"
          label="password"
          type="password"
          required
        )
        v-text-field(
          v-model="ic"
          :rules="icRules"
          label="Invite Code"
          required
        )
        v-btn(
          :disabled="!valid"
          @click="onSubmit"
        ) submit
        v-btn(
          to="/signin"
        ) sign in
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      valid: false,
      XD: true,
      username: '',
      password: '',
      rpassword: '',
      uValid: true,
      ic: '',
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && /^[\da-z]+$/i.test(v)) || 'Invalid character!',
        v => (v && v.length >= 6) || '6 characters at least',
        v => this.uValid || 'ducplicated'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || '6 characters at least'
      ],
      rpasswordRules: [
        v => !!v || 'Password is required',
        v => v == this.password || 'Not the same'
      ],
      icRules: [
        v => !!v || 'Invite Code is required'
        //
      ]
    }
  },
  methods: {
    usernameOnFocus() {
      this.uValid = true
    },
    onSuccess(data) {
      // this.$store.commit('setAuth', data)
    },
    onSubmit() {
      // this.$store.commit('login')
      if (this.$refs.form.validate()) {
        axios
          .post('/api/u/signup', {
            username: this.username,
            password: md5(this.password)
          })
          .then(res => {
            if (res.data.success === true) {
              // do sth
              this.$router.replace('/')
            } else {
              this.uValid = false
              this.$refs.form.validate()
            }
          })
      }
    }
  }
}
</script>
