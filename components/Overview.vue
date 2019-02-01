<template lang="pug">
v-card
  v-card-title
    div.title Domain: {{ title }}
    v-spacer
    slot(name="action")
  v-card-text
    v-layout(row wrap :reverse="$vuetify.breakpoint.name === 'xs'")
      v-flex(d-flex xs12 sm8 md9)
        v-layout(row wrap)
          v-flex(xs12)
            slot(name="main")
          v-flex(xs12 v-if="eventType === 'activity'")
            v-list(dense)
              v-subheader Activity
              template(v-for="(value, key) in data")
                v-list-tile(:key="key")
                  v-list-tile-content {{ key }}
                  v-list-tile-content.align-end {{ value }}
      v-flex(d-flex xs12 sm4 md3
        align-center
        justify-center
        layout
        text-xs-center
      )
        slot(name="avatar")
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
          if (item === 'meta' || item === '_id' || item == '__v') continue
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
