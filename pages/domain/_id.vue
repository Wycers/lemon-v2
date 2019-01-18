<template lang="pug">
div
  div {{ domain }} {{ active }}
  div.headline {{ domain.domain.name }}
  v-tabs(
    v-model="active"
    color="cyan"
    dark
    slider-color="yellow"
  )
    v-tab(ripple) Overview
    v-tab-item 
      v-card(flat)
        v-card-title {{ domain.intro }}

    v-tab(ripple) Resources
    v-tab-item
      Resource(:id="id" :isAdmin="domain.isAdmin" :rootId="domain.domain.folder")

    v-tab(ripple) Announcements
    v-tab-item
      v-card(flat)
        v-card-title announcements

    v-tab(ripple) Work flow
    v-tab-item
      v-card(flat)

        v-card-title work flow

    v-tab(ripple @click="fetchUsers") Users
    v-tab-item
      User(:id="id" :users="users" :isAdmin="domain.isAdmin")

    //- Setting tab
    v-tab(v-if="domain.isAdmin") Settings
    v-tab-item(v-if="domain.isAdmin")
      Settings(
        :eventId="domain.domain.eventId"
        :eventType="domain.domain.eventType"
        :domainId="id"
      )
</template>

<script>
import http from '~/utils/http'
import User from '~/components/User'
import Resource from '~/components/Resource'
import Workflow from '~/components/Workflow'
import Settings from '~/components/Settings'
export default {
  components: {
    User,
    Resource,
    Workflow,
    Settings
  },
  async asyncData({ params }) {
    const res = await http.get(`/domain/${params.id}`)
    return {
      id: params.id,
      domain: res.data
    }
  },
  data() {
    return {
      active: null,
      users: []
    }
  },
  methods: {
    fetchUsers() {
      http.get(`/domain/${this.id}/users`).then(res => {
        this.users = res.data.data
      })
    }
  }
}
</script>
