<template lang="pug">
div
  div {{ domain }} {{ active }}
  v-tabs(
    v-model="active"
    color="primary"
    dark
    slider-color="yellow"
  )
    v-tab(ripple) Overview {{ domain.name }}
    v-tab-item 
      Overview(
        :eventId="domain.eventId"
        :eventType="domain.eventType"
      )
        div hhh {{ domain.intro }}

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
        :domainId="id"
        :isAdmin="isAdmin"
      )

    //- Setting tab
    v-tab(v-if="isAdmin") Settings
    v-tab-item(v-if="isAdmin")
      Settings(
        :eventId="domain.eventId"
        :eventType="domain.eventType"
        :domainId="id"
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
    const res1 = await http.get(`/domain/${params.id}`)
    const res2 = await http.get(`/domain/${params.id}/role`)
    // TODO: network error
    return {
      id: params.id,
      domain: res1.data.domain,
      isAdmin: res2.data.isAdmin
    }
  },
  data() {
    return {
      active: null
    }
  }
}
</script>
