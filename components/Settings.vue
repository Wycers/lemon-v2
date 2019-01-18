<template lang="pug">
v-card
  v-card-title
    div.title Settings
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
      @click="save"
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
        v-model="commonFields.name.value"
        required
      )
      v-text-field(
        label="Avatar"
        v-model="commonFields.avatar.value"
      )
      v-text-field(
        label="Introduction"
        v-model="commonFields.intro.value"
      )
      v-layout
        v-flex.xs-6
          v-switch(
            label="Publish"
            v-model="public"
            color="primary"
          )
    div {{ commonFields }}
    v-divider
    div.subheading For {{ eventType }} domain
    v-layout(row wrap)
      v-flex(
        xs12 md6
        v-for="(item, field) in eventFields"
        :key="field"
      )
        DateTimePicker(
          v-if="item.type == 'time'"
          :label="field"
          :datetime="item.value"
        )
        v-text-field(
          v-else-if="item.type == 'number'"
          v-model="item.value"
          :label="field"
          type="number"
        )
        v-text-field(
          v-else-if="item.type == 'string'"
          v-model="item.value"
          :label="field"
        )
      div {{ eventFields }}
      
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
      public: false,
      snackbar: {
        model: false,
        text: '',
        color: 'info'
      },
      commonFields: {
        name: {
          value: '',
          type: 'string',
          required: true
        },
        avatar: {
          value: '',
          type: 'string'
        },
        intro: {
          value: '',
          type: 'string',
          required: true
        },
        status: {
          value: '',
          type: 'string'
        }
      },
      eventFields: {}
    }
  },
  mounted() {
    this.fetch()
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
        const res = await http.get(`/domain/${this.domainId}/settings`)
        if (res.data.code === 0) {
          const data = res.data.data
          console.log('xd')
          this.commonFields = {
            name: {
              value: data.common.name,
              type: 'string',
              required: true
            },
            avatar: {
              value: data.common.avatar,
              type: 'string'
            },
            intro: {
              value: data.common.intro,
              type: 'string',
              required: true
            },
            status: {
              value: data.common.status,
              type: 'string'
            }
          }
          if (data.common.status == 'private') this.public = false
          else this.public = true

          this.eventFields = data.event
        }
      }
    },
    async save() {
      let res = {}
      for (var field in this.commonFields)
        res[field] = this.commonFields[field].value
      for (var field in this.eventFields)
        res[field] = this.eventFields[field].value
      res.status = this.public == true ? 'public' : 'private'
      console.log(res)
    }
  }
}
</script>
