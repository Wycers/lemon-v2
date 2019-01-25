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
          label="username" v-model="username" :rules="usernameRules" required
          @focus="onFocus"
          
        )
        v-text-field(
          label="password" v-model="password" :rules="passwordRules" required
          @focus="onFocus"
          type="password"
        )
        v-alert(v-model="toggle" :color="color" :icon="icon") 
          div {{ message }}
        v-btn(
          :disabled="!valid"
          @click="onSubmit"
          round
        ) submit
        v-btn(
          to="/signup"
          round
        ) sign up
</template>

<script>
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
          await this.$store.dispatch('user/signin', { username, password })
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
