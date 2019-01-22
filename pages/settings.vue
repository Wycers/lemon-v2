<template lang="pug">
cuavatar(
  :src="avatar"
  size=128
  @crop-success="cropSuccess"
  @crop-upload-success="cropUploadSuccess"
  @crop-upload-fail="cropUploadFail"
)
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import CUAvatar from '~/components/CUAvatar'
export default {
  components: {
    cuavatar: CUAvatar
  },
  fetch({ store, redirect }) {
    if (!store.state.auth.token) {
      return redirect('/')
    }
  },
  data() {},
  computed: {
    ...mapState({
      nickname: state => state.auth.nickname,
      avatar: state => state.auth.avatar,
      token: state => state.auth.token
    })
  },
  methods: {
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    cropUploadSuccess(data, field) {
      console.log('-------- upload success --------')
      console.log(data)
      console.log('field: ' + field)
      if (data.success === true) {
        try {
          this.$store.commit('auth/SET_USER', {
            avatar: data.url
          })
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
