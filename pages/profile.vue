<template lang="pug">
v-card()
  v-card-title.title Edit profile
  v-card-text
    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light Public Avatar
      v-flex.my-3(xs12 lg3)
        cuavatar(
          :src="avatar"
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
          label="Nickname"
          v-model="nickname"
          required
          box
        )
        v-text-field(
          label="Email"
          v-model="nickname"
          required
          box
        )
        v-select(
          :items="['SUSTech English', 'Simplified Chinese']"
          box
          label="Preferred language"
        )
        //- v-text-field(
        //-   label="Introduction"
        //-   v-model=""
        //-   box
        //- )

      v-flex.my-3(xs12 lg9)
        v-btn(color="primary") Update profile
        v-btn cancel
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import CUAvatar from '~/components/CUAvatar'
export default {
  middleware: 'auth',
  components: {
    cuavatar: CUAvatar
  },
  data() {
    return {}
  },
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
