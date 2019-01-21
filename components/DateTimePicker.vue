<template lang="pug">
div
  //- div {{ datetime }} {{ utc }}
  v-menu(
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="50"
    :return-value.sync="time"
    lazy
    transition="fade-transition"
    offset-y
    full-width
    min-width="290px"
    max-width="290px"
  )
    v-text-field(
      slot="activator"
      v-model="display"
      :label="field"
      prepend-icon="event"
      @click="now = true, menu = true"
    )
    v-date-picker(
      v-if="now"
      v-model="date"
      @input="now = false"
      scrollable
      locale="zh-cn"
    )
    v-time-picker(
      v-else
      v-model="time"
      @change="$refs.menu.save(time)"
      format="24hr"
      scrollable
      locale="zh-cn"
    )
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
export default Vue.extend({
  props: {
    field: {
      type: String,
      required: true
    },
    datetime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      now: false,
      menu: false,
      date: null,
      time: null
    }
  },
  computed: {
    display() {
      return moment(this.date + ' ' + this.time).format('YYYY年MMMDo, HH:mm')
    }
  },
  // TODO: 这里似乎有一种更优雅的.sync写法
  watch: {
    datetime() {
      this.date = moment(this.datetime).format('YYYY-MM-DD')
      this.time = moment(this.datetime).format('HH:mm')
      this.$emit('change', {
        key: this.field,
        value: moment(this.date + ' ' + this.time)
          .utc()
          .format()
      })
    }
  },
  created() {
    this.date = moment(this.datetime).format('YYYY-MM-DD')
    this.time = moment(this.datetime).format('HH:mm')
    moment.locale('zh-cn')
  }
})
</script>
