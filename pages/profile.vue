<template lang="pug">
v-card
  v-card-title.title {{ $t('profile.title') }}
  v-card-text
    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light {{ $t('profile.avatar') }}
      v-flex.my-3(xs12 lg3)
        cuavatar(
          :uploadUrl="'/user/avatar'"
          :src="avatar"
          :size="128"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
        )
    v-divider.my-3
    v-menu(offset-y)
      v-btn(slot="activator" icon)
        v-icon language
      v-list
        v-list-tile(v-for="lang in locales" :key="lang.value" @click="setlocale(lang.value)")
          v-list-tile-title {{ lang.text }}
    v-layout(row wrap text-xs-center)
      v-flex.my-3(xs12 lg3)
        div.title.font-weight-light {{ $t('profile.settings') }}
      v-flex.my-3(xs12 lg9)
        v-form(ref="common_setting" color="white")
          v-text-field(
            v-model="nickname"
            :label="$t('field.profile.nickname')"
            required
            box
          )
          v-text-field(
            v-model="email"
            :label="$t('field.profile.email')"
            required
            box
          )
          v-select(
            v-model="locale"
            :label="$t('field.profile.locale')"
            box
            :items="locales"
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
        ) {{ $t('profile.update') }}
        v-btn(
          @click="reset"
        ) {{ $t('profile.reset') }}
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
      return res.data
    } catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      locales: ['en', 'zh-cmn-Hans', 'zh-cmn-Hant'].map(item => ({
        text: this.$t('name', item),
        value: item
      })),
      locale: ''
    }
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val
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
          this.avatar = data.url
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
        const data = {
          nickname: this.nickname,
          email: this.email,
          avatar: this.avatar,
          locale: this.locale
        }
        const res = await http.post('/profile', data)
        this.$store.commit('user/SET_STATUS', data)
      } catch (err) {
        console.log(err)
      }
    },
    async reset() {
      try {
        const res = await http.get('/profile')
        this.avatar = res.data.avatar
        this.email = res.data.email
        this.nickname = res.data.nickname
        this.locale = res.data.locale
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
