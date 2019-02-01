<template lang="pug">
div
  div {{ domain }} {{ active }}
  v-tabs(
    v-model="active"
    color="primary"
    dark
    slider-color="yellow"
  )
    v-tab(ripple) Overview
    v-tab-item 
      Overview(
        :title="domain.name"
        :eventId="eventId"
        :eventType="eventType"
      )
        template(slot="action")
          v-btn(
            color="red lighten-2"
            dark
            @click="join"
          ) Join
          v-btn(
            color="red lighten-2"
            dark
            @click="quit"
          ) Quit
        template(slot="avatar")
          v-avatar(
            size="128"
          )
            img(
              :src="domain.avatar"
              alt="avatar"
            ) 
        template(slot="main")
          p {{ domain.intro }}

    v-tab Users
    v-tab-item
      User(
        :domainId="domainId"
        :isAdmin="isAdmin"
      )

    //- Setting tab
    v-tab(v-if="isAdmin") Settings
    v-tab-item(v-if="isAdmin")
      Settings(
        :eventId="eventId"
        :eventType="eventType"
        :domainId="domainId"
      )
</template>

<script>
import http from '~/utils/http'
import User from '~/components/User'
import Overview from '~/components/Overview'
import Resource from '~/components/Resource'
import Settings from '~/components/Settings'
export default {
  middleware: 'auth',
  components: {
    User,
    Overview,
    Resource,
    Settings
  },
  async asyncData({ params }) {
    const res1 = await http.get(`/domain/${params.domainId}`)
    const res2 = await http.get(`/domain/${params.domainId}/role`)
    // TODO: network error
    return {
      domainId: params.domainId,
      domain: res1.data.data,
      eventId: res1.data.data.eventId,
      eventType: res1.data.data.eventType,
      isAdmin: res2.data.data.isAdmin
    }
  },
  inject: ['reload'],
  data() {
    return {
      active: null
    }
  },
  methods: {
    async join() {
      try {
        const res = await http.post(`/domain/${this.domainId}/join`)
        this.reload()
      } catch (err) {
        console.err(err)
      }
    },
    async quit() {
      try {
        const res = await http.post(`/domain/${this.domainId}/quit`)
        this.reload()
      } catch (err) {
        console.err(err)
      }
    }
  }
}
</script>
