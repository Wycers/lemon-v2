<template lang="pug">
v-layout(row)
  div {{ date }} {{ time }}
  v-menu(
    :close-on-content-click="false"
    v-model="dateMenu"
    :nudge-right="40"
    lazy
    transition="fade-transition"
    offset-y
  )
    v-text-field(
      slot="activator"
      v-model="date"
      :label="`${label} - Date`"
      prepend-icon="event"
      readonly
      max-width="50px"
    )
    v-date-picker(
      v-model="date"
      @input="dateMenu = false"
    )
  v-menu(
    ref="menu"
    :close-on-content-click="false"
    v-model="timeMenu"
    :nudge-right="40"
    :return-value.sync="time"
    lazy
    transition="fade-transition"
    offset-y
  )
    v-text-field(
      slot="activator"
      v-model="time"
      :label="`${label} - Time`"
      prepend-icon="access_time"
      readonly
      max-width="50px"
    )
    v-time-picker(
      v-model="time"
      @change="$refs.menu.save(time)"
      format="24hr"
    )
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeMenu: false,
      dateMenu: false,
      date: '',
      time: ''
    }
  }
})
</script>
