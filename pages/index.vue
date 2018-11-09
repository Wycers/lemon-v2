<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex
      xs12
      sm8
      md6>
      <v-carousel>
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item.src"/>
      </v-carousel>
      <v-card>
        <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
        <v-card-text>
          <p> {{ nickname }}</p>
          <p>Vuetify is a progressive Material Design component framework for Vue.js. It was designed to empower developers to create amazing applications.</p>
          <p>For more information on Vuetify, check out the <a
            href="https://vuetifyjs.com"
            target="_blank">documentation</a>.</p>
          <p>If you have questions, please join the official <a
            href="https://chat.vuetifyjs.com/"
            target="_blank"
            title="chat">discord</a>.</p>
          <p>Find a bug? Report it on the github <a
            href="https://github.com/vuetifyjs/vuetify/issues"
            target="_blank"
            title="contribute">issue board</a>.</p>
          <p>Thank you for developing with Vuetify and I look forward to bringing more exciting features in the future.</p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3">
          <a
            href="https://nuxtjs.org/"
            target="_blank">Nuxt Documentation</a>
          <br>
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank">Nuxt GitHub</a>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/inspire">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.nickname,
      avatar: state => state.auth.avatar,
      token: state => state.auth.token
    })
  }
}
</script>
