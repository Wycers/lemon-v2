<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed 
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"/>
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
      <v-spacer />
      <div v-if="token !== null" >
        <v-avatar
          :size="40"
          color="grey lighten-4"
        >
          <img 
            :src=" avatar "
            alt="avatar">
        </v-avatar>
        <v-menu offset-y>
          <v-btn
            slot="activator"
            flat
            color="primary"> 
            {{ nickname }} 
          </v-btn>
          <v-list>
            <v-list-tile to="/settings">
              <v-list-tile-title> 账号设置 </v-list-tile-title>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="signout">
              <v-list-tile-title> 登出 </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn 
          flat 
          large 
          color="primary"
          to="/signin">Sign in</v-btn>
        <v-btn 
          flat 
          large 
          color="primary"
          to="/signup">Sign up</v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      :right="right"
      v-model="rightDrawer"
      temporary
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <v-spacer />
      <span> Wycer &copy; 2017</span>
      <span>
        <v-icon small>build</v-icon>
        {{ commit }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Lemon-v2'
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.auth.nickname,
      avatar: state => state.auth.avatar,
      token: state => state.auth.token
    }),
    commit() {
      let XD = document.getElementsByTagName('meta')[3].getAttribute('commit')
      return `Build:${XD.substring(0, 8)}`
    }
  },
  methods: {
    async signout() {
      try {
        await this.$store.dispatch('auth/signout')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
