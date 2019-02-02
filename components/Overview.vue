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
      :disabled="!role.permissions.base.quit"
      @click="quit"
    ) Quit
  v-card-text
    v-layout(row wrap :reverse="$vuetify.breakpoint.name === 'xs'")
      v-flex(xs12)
        v-alert(
          v-for="(alert, i) in alerts"
          v-model="alert.toggle"
          dismissible
          :type="alert.type"
          :key="i"
          transition="scale-transition"
        ) {{ alert.content }}
      v-flex.my-3(d-flex xs12 sm8 md9)
        v-layout(row wrap)
          v-flex(xs12)
            p {{ domain.intro }}
          v-flex(xs12 v-if="domain.eventType === 'activity'")
            v-list(dense)
              v-subheader Activity
              template(v-for="(value, key) in event")
                v-list-tile(:key="key")
                  v-list-tile-content {{ key }}
                  v-list-tile-content.align-end(v-if="key==='limit'") {{ value }}
                  v-list-tile-content.align-end(v-else) {{ convertTime(value) }}
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
      event: {},
      alerts: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.fetch()
    })
    moment.locale('zh-cn')
  },
  methods: {
    convertTime(time) {
      if (moment(time).get('year') === moment().get('year'))
        return moment(time).format('MMMDo(dddd), HH:mm')
      else return moment(time).format('YYYY MMMM Do dddd, H:mm ')
    },
    diffInMinutes(time1, time2) {
      return moment(time1).diff(moment(time2), 'minutes')
    },
    diffInHours(time1, time2) {
      return moment(time1).diff(moment(time2), 'hours')
    },
    async fetch() {
      const res = await http.get(
        `/${this.domain.eventType}/${this.domain.eventId}`
      )
      if (this.domain.eventType === 'activity') {
        if (res.data.code === 0) {
          let tmp = {}
          for (var item in res.data.data) {
            if (item === 'meta' || item === '_id' || item == '__v') continue
            if (item === 'limit') tmp[item] = res.data.data[item]
            else tmp[item] = res.data.data[item]
          }
          this.event = tmp

          if (this.diffInMinutes(moment(), this.event.acceptStart) < 0) {
            // 未开始
            const diffm = this.diffInMinutes(
              this.event.acceptStart,
              this.event.acceptEnd
            )
            if (diffm <= 2) {
              this.alerts.push({
                toggle: true,
                content:
                  'Please pay attention to the short time of accepting registration.\n' +
                  'Maybe you can contact administrator.',
                type: 'error'
              })
            }
            const diffh = this.diffInHours(moment(), this.event.acceptStart)
            if (diffh == 0) {
              this.alerts.push({
                toggle: true,
                content: `Acceptance begins after ${diffm} minute(s).`,
                type: 'warning'
              })
            } else if (diffh <= 2) {
              this.alerts.push({
                toggle: true,
                content: `Acceptance begins after ${diffh} hour(s).`,
                type: 'warning'
              })
            } else {
              this.alerts.push({
                toggle: true,
                content: `Waiting acceptance.`,
                type: 'warning'
              })
            }
          } else if (this.diffInMinutes(this.event.acceptEnd, moment()) < 0) {
            // 已经结束报名
            this.alerts.push({
              toggle: true,
              content: `Acceptance has ended.`,
              type: 'info'
            })
          } else {
            const diffm = this.diffInMinutes(this.event.acceptEnd, moment())
            const diffh = this.diffInHours(this.event.acceptEnd, moment())
            if (diffh == 0) {
              this.alerts.push({
                toggle: true,
                content: `Acceptance ends after ${diffm} minute(s).`,
                type: 'warning'
              })
            } else if (diffh <= 2) {
              this.alerts.push({
                toggle: true,
                content: `Acceptance ends after ${diffh} hour(s).`,
                type: 'warning'
              })
            } else {
              this.alerts.push({
                toggle: true,
                content: `Registering`,
                type: 'info'
              })
            }
          }
        }
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
