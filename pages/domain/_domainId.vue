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
        v-avatar(
          v-if="domain.avatar"
          :size="avatarSize || 32"
        )
          img(:src="domain.avatar" alt="avatar")
        div XD

    //- v-tab(ripple) Resources
    //- v-tab-item
    //-   Resource(:id="id" :isAdmin="isAdmin" :rootId="domain.folder")

    //- v-tab(ripple) Announcements
    //- v-tab-item
    //-   v-card(flat)
    //-     v-card-title announcements

    //- v-tab(ripple) Work flow
    //- v-tab-item
    //-   Workflow

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
import Workflow from '~/components/Workflow'
import Settings from '~/components/Settings'
export default {
  components: {
    User,
    Overview,
    Resource,
    Workflow,
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
  data() {
    return {
      active: null
    }
  }
}
</script>
