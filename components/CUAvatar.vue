<template lang="pug">
div
  v-avatar(
    :size="size"
    @mouseenter="enter"
    @mouseleave="leave"
  )
    transition(name="bounce")
      v-btn(
        v-if="mask"
        class="mask"
        flat
        dark
        @click="toggleShow"
      ) set
    img(:src="src")
  vicu(
    v-model="show"
    :width="300"
    :height="300"
    :params="params"
    :noSquare="true"
    img-format="png"
    field="file"
    url="http://upload-z2.qiniup.com"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
  )
</template>
<script>
import vicu from 'vue-image-crop-upload'
import http from '~/utils/http'
export default {
  components: {
    vicu
  },
  props: {
    uploadUrl: {
      type: String,
      default: '',
      requried: true
    },
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
      mask: false,
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  methods: {
    async toggleShow() {
      const res = await http.post(this.uploadUrl)
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
      console.log(data)
      this.src = data.url
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
    },
    enter() {
      this.mask = true
    },
    leave() {
      this.mask = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.mask {
  background-color: black;
  position: absolute;
  opacity: 0.6;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  margin: auto;
  vertical-align: middle;
  text-align: center;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}
</style>
