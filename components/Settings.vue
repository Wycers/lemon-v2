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
    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light Public Avatar
      v-flex.my-3(xs12 lg3)
        CUAvatar(
          :uploadUrl="`/domain/${domainId}/avatar`",
          :src="commonFields.avatar.value"
          :size="128"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
        )
    v-divider.my-3

    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light Main Settings
      v-flex.my-3(xs12 lg9)
        v-form(ref="common_setting" color="white")
          v-text-field(
            label="Domain name"
            v-model="commonFields.name.value"
            required
            box
          )
          v-text-field(
            label="Domain introduction"
            v-model="commonFields.intro.value"
            required
            box
          )
    v-divider.my-3

    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light Event Settings
        div.subheading.font-weight-light {{ eventType }}
      v-flex.my-3(xs12 lg9)
        v-form(ref="common_setting" color="white")
          v-flex(
            xs12 md6
            v-for="(item, field) in eventFields"
            :key="field"
          )
            DateTimePicker(
              v-if="item.type == 'time'"
              :field="field"
              @change="change"
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
import CUAvatar from '~/components/CUAvatar'
export default {
  components: {
    DateTimePicker,
    CUAvatar
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
    change(kv) {
      this.$set(this.eventFields[kv.key], 'value', kv.value)
    },
    async fetch() {
      const res = await http.get(`/domain/${this.domainId}/settings`)
      if (res.data.code === 0) {
        const data = res.data.data
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
    },
    async save() {
      let tmp = {}
      for (var field in this.commonFields)
        tmp[field] = this.commonFields[field].value
      for (var field in this.eventFields)
        tmp[field] = this.eventFields[field].value
      tmp.status = this.public == true ? 'public' : 'private'
      console.log(tmp)
      const res = await http.post(`/domain/${this.domainId}/settings`, tmp)
      console.log(res)
    },
    cropSuccess(imgDataUrl, field) {
      this.imgDataUrl = imgDataUrl
    },
    cropUploadSuccess(data, field) {
      console.log('-------- upload success --------')
      console.log(data)
      console.log('field: ' + field)
      if (data.success === true) {
        try {
          this.commonFields.avatar.value = data.url
        } catch (error) {
          alert('failed')
        }
      } else {
        alert('failed')
      }
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>
