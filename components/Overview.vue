<template lang="pug">
v-card
  v-card-title
    div.title Domain: {{ title }}
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
    ) Save
  v-card-text
    slot
    v-list(v-if="eventType === 'activity'")
      v-subheader Activity
      v-list-tile
        v-list-tile-content
          v-list-tile-title The activity will be held during {{ data.activityStart }} to {{ data.activityEnd }}.
      v-list-tile
        v-list-tile-content
          v-list-tile-title You can join the activity between {{ data.acceptStart }} and {{ data.acceptEnd }}.
      v-list-tile
        v-list-tile-content
          v-list-tile-title You can quit the activity between {{ data.cancelStart }} and {{ data.cancelEnd }}.
      v-list-tile
        v-list-tile-content
          v-list-tile-title(v-if="data.limit == 0") There is no limit on the number of people.
          v-list-tile-title(v-else) Limit {{ data.limit }} people to participate.
</template>
<script>
import http from '~/utils/http'
import moment from 'moment'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
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
    return {
      data: {}
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await http.get(`/${this.eventType}/${this.eventId}`)
      if (res.data.code === 0) {
        let tmp = {}
        for (var item in res.data.data) {
          if (item === 'meta') continue
          if (item === 'limit') tmp[item] = res.data.data[item]
          else
            tmp[item] = moment(res.data.data[item]).format('YYYY年MMMDo, HH:mm')
        }
        this.data = tmp
      }
    }
  }
}
</script>
