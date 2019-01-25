<template lang="pug">
v-card
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
          v-model="email"
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
        v-btn(
          color="primary"
          @click="submit"
        ) Update profile
        v-btn cancel
</template>

<script>
import http from '~/utils/http'
// import { mapState } from 'vuex'
import CUAvatar from '~/components/CUAvatar'
export default {
  middleware: 'auth',
  components: {
    cuavatar: CUAvatar
  },
  async asyncData() {
    try {
      const res = await http.get('/profile')
      if (res.data.code === 0) return res.data.data
      throw new Error(res.data.msg)
    } catch (err) {
      console.log(err)
    }
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
          this.$store.commit('user/SET_STATUS', {
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
    },
    async submit() {
      try {
        const res = await http.post('/profile', {
          nickname: this.nickname,
          email: this.email,
          avatar: this.avatar
        })
        if (res.data.code === 0) {
          console.log('ok')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
