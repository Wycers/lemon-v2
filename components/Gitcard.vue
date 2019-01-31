<template lang="pug">
v-flex(xs12 sm6 md4 lg3 mt-4 my-3)
  v-card(v-if="profile")
    v-img(
      :src="profile.avatar_url"
      height="200px"
    )
      v-container(
        fill-height
        fluid
      )
        v-layout(fill-height)
          v-flex(
            xs12
            align-end
            flexbox
          )
            span(class="headline white--text") {{ profile.bio }}
    v-card-text
      span.body-1.mr-4
        v-icon(
          color="primary"
        ) account_circle
        | {{ profile.name }}
      span.body-1.mr-4
        v-icon(
          color="primary"
        ) place
        | {{ profile.location }}
    v-card-actions
      v-chip
        v-avatar
          v-icon people
        |  Followers: {{ profile.followers }}
      //- v-chip
      //-   v-avatar
      //-     v-icon list
      //-   | Repos: {{ profile.public_repos }}
      v-spacer
      v-btn(
        flat
        icon
        color="primary"
        @click = "snackbar = !snackbar"
      ) 
        v-icon thumb_up
      v-btn(
        flat
        icon
        color="primary"
        :href="href"
        target="_blank"
      ) 
        v-icon arrow_forward
  content-placeholders(
    v-else
    :rounded="true"
  )
    content-placeholders-img
    content-placeholders-text(:lines="3")
  v-snackbar(
    v-model="snackbar"
    top
    right
  ) 谢谢点赞
    v-btn(
      flat
      color="pink"
      @click.native="snackbar = false"
    ) 关闭
</template>
<script>
import axios from 'axios'
export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      snackbar: false,
      profile: null,
      href: 'https://github.com/Wycers',
      repos: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.getInfo()
    })
  },
  methods: {
    async getInfo() {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${this.username}`
        )
        this.profile = res.data
      } catch (err) {
        console.err(err)
      }
    }
  }
}
</script>
