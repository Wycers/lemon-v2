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
        <template v-for="(item, i) in items">
          <v-list-tile
            v-if="item.to"
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
          <v-list-group
            v-else
            :key="i"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in item.items"
              :key="subItem.title"
              :to="subItem.to"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </template>
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
            <v-list-tile to="/profile">
              <v-list-tile-title> 账号设置 </v-list-tile-title>
            </v-list-tile>
            <v-divider />
            <v-list-tile to="/signout">
              <v-list-tile-title> 登出 </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <v-toolbar-items
        v-else
        class="hidden-sm-and-down"
      >
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
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container v-if="$vuetify.breakpoint.name !== 'xs'">
        <nuxt />
      </v-container>
      <nuxt v-else/>
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
      <span> Wycer &copy; 2019</span>
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
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Domain',
          to: '/domain'
          // items: [
          //   {
          //     title: '课程域',
          //     to: '/domain'
          //   },
          //   {
          //     title: '部门域',
          //     to: '/domain'
          //   },
          //   {
          //     title: '项目域',
          //     to: '/domain'
          //   },
          //   {
          //     title: '活动域',
          //     to: '/domain'
          //   }
          // ]
        },
        {
          icon: 'info',
          title: 'About',
          to: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Lemon-v2'
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      avatar: state => state.user.avatar,
      token: state => state.user.token
    }),
    commit() {
      let XD = document.getElementsByTagName('meta')[3].getAttribute('commit')
      return `Build:${XD.substring(0, 8)}`
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    if (token) {
      await this.$store.commit('user/SET_USER', { token })
      await this.$store.dispatch('user/fetchProfile')
    }
  }
}
</script>
