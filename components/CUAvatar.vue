<template lang="pug">
div
  v-avatar(
    :size="size"
  )
    img(:src="src")
  v-btn(
    @click="toggleShow"
  ) set avatar
  vicu(
    v-model="show"
    :width="300"
    :height="300"
    :params="params"
    img-format="png"
    field="file"
    url="http://upload-z2.qiniup.com"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
  )
    img(:src="imgDataUrl")
</template>
<script>
import vicu from 'vue-image-crop-upload'
import http from '~/utils/http'
export default {
  components: {
    vicu
  },
  props: {
    src: {
      type: String,
      default: '',
      requried: true
    },
    size: {
      type: Number,
      default: 32,
      requried: true
    }
  },
  data() {
    return {
      imageFile: '',
      show: false,
      params: {
        token: '',
        key: ''
      },
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  methods: {
    async toggleShow() {
      const res = await http.post('/qiniu/upload', {
        token: this.$store.state.token
      })
      console.log(res)
      this.params = {
        token: res.data.token,
        key: res.data.key
      }
      this.show = !this.show
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      this.$emit('crop-success', imgDataUrl, field)
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(data, field) {
      this.$emit('crop-upload-success', data, field)
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      this.$emit('crop-upload-failed', status, field)
    }
  }
}
</script>
