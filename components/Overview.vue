<template lang="pug">
v-card
  v-card-title
    div.title Domain: {{ domain.name }}
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
      :disabled="!role.permissions.base.join"
      @click="join"
    ) Join
    v-btn(
      color="red lighten-2"
      dark
      :disabled="!role.permissions.base.quit"
      @click="quit"
    ) Quit
  v-card-text
    v-layout(row wrap :reverse="$vuetify.breakpoint.name === 'xs'")
      v-flex(d-flex xs12 sm8 md9)
        v-layout(row wrap)
          v-flex(xs12)
            p {{ domain.intro }}
          v-flex(xs12 v-if="domain.eventType === 'activity'")
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
        v-avatar(
          size="128"
        )
          img(
            :src="domain.avatar"
            alt="avatar"
          ) 
</template>
<script>
import http from '~/utils/http'
import moment from 'moment'
export default {
  props: {
    domain: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    role: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.fetch()
    })
  },
  methods: {
    async fetch() {
      const res = await http.get(
        `/${this.domain.eventType}/${this.domain.eventId}`
      )
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
    },
    async join() {
      try {
        const res = await http.post(`/domain/${this.domain.domainId}/join`)
        this.reload()
      } catch (err) {
        console.err(err)
      }
    },
    async quit() {
      try {
        const res = await http.post(`/domain/${this.domain.domainId}/quit`)
        this.reload()
      } catch (err) {
        console.err(err)
      }
    }
  }
}
</script>
