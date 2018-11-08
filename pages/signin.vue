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
          @focus="onFocus"
          label="username"
          required
        )
        v-text-field(
          v-model="password"
          :rules="passwordRules"
          @focus="onFocus"
          label="password"
          type="password"
          required
        )
        v-alert(v-model="toggle" :color="color" :icon="icon") 
          div {{ message }}
        v-btn(
          :disabled="!valid"
          @click="onSubmit"
        ) submit
        v-btn(
          to="/signup"
        ) sign up
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      uValid: true,
      valid: true,
      username: '',
      password: '',
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 6) || '6 characters at least',
        v => this.uValid || 'Username or Password Wrong'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || '6 characters at least',
        v => this.uValid || 'Username or Password Wrong'
      ],
      color: 'info',
      icon: 'info',
      toggle: false,
      message: null
    }
  },
  methods: {
    onFocus() {
      this.toggle = false
    },
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const username = this.username
        const password = this.password
        try {
          await this.$store.dispatch('auth/signin', { username, password })
          this.color = 'success'
          this.icon = 'check_circle'
          this.message = 'success'
          this.toggle = true
          setTimeout(() => {
              this.$router.replace('/')
          }, 1000)
        } catch (error) {
          this.color = 'error'
          this.icon = 'error'
          this.toggle = true
          this.message = 'error'
            }
      }
    }
  }
}
</script>
