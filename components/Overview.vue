<template lang="pug">
v-card
  v-card-title
    div.title Overview
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
    ) Save
  v-card-text
    slot
    div {{ eventType }}
</template>
<script>
import http from '~/utils/http'
export default {
  props: {
    eventType: {
      type: String,
      required: true
    },
    eventId: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await http.get(`/${this.eventType}/${this.eventId}`)
      console.log(res.data)
    }
  }
}
</script>
