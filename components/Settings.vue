<template lang="pug">
v-card
  v-card-title
    div.title Settings
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
    ) Save
    v-btn(
      color="red lighten-2"
      dark
      @click="fetch"
    ) Reset
  v-card-text
    div.subheading Common
    v-form(ref="common_setting" color="white")
      v-text-field(
        label="Domain Name"
        required
      )
      v-text-field(
        label="Avatar"
      )
      v-text-field(
        label="Introduction"
      )
      v-layout
        v-flex.xs-6
          v-switch(
            label="Publish"
            color="primary"
          )
        v-flex.xs-6
          v-switch(
            label="Questionary"
            color="primary"
          )
        v-flex.xs-6
          v-switch(
            label="Work flow"
            color="primary"
          )
        
        v-flex.xs-6
          v-switch(
            label="Resources"
            color="primary"
          )
        v-flex.xs-6
          v-switch(
            label="Announcements"
            color="primary"
          )
    v-divider
    div.subheading For {{ eventType }} domain
    template(v-for="(item, field) in eventFields")
      DateTimePicker(
        v-if="item.type == 'time'"
        :label="field"
        :datetime="item.value"
        :key="field"
      )
      
  v-snackbar(
    v-model="snackbar.model"
    :color="snackbar.color"
    right
    top
    :timeout="parseInt('3000')"
  ) {{ snackbar.text }}
</template>
<script>
import http from '~/utils/http'
import DateTimePicker from '~/components/DateTimePicker'
export default {
  components: {
    DateTimePicker
  },
  props: {
    domainId: {
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
      dialog: false,
      loading: false,
      model: null,
      search: null,
      snackbar: {
        model: false,
        text: '',
        color: 'info'
      },
      commonFields: {},
      eventFields: {}
    }
  },
  methods: {
    showSnackbar(text, color) {
      this.snackbar = {
        model: true,
        text: text,
        color: color
      }
    },
    async fetch() {
      const res = await http.get(`/domain/${this.domainId}/settings`)
      if (res.data.code === 0) {
        this.commonFields = res.data.data.common
        this.eventFields = res.data.data.event
      }
    },
    async save() {
      alert(form)
    }
  }
}
</script>
