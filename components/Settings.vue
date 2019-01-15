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
    ) Reset
  v-card-text
    div {{ type }}
    v-form(ref="form" color="white")
      v-text-field(
        label="Domain Name"
        required
      )
      v-switch(
        label="Questionary"
        :color="primary"
      )
      v-switch(
        label="Work flow"
        :color="primary"
      )
      v-switch(
        label="Publish"
        :color="primary"
      )
      v-switch(
        label="Resources"
        :color="primary"
      )
      v-switch(
        label="Announcements"
        :color="primary"
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
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      model: null,
      search: null,
      entries: [],
      form: {
        name: ''
      },
      snackbar: {
        model: false,
        text: '',
        color: 'info'
      }
    }
  },
  computed: {
    items() {
      return this.entries.map(entry => {
        const Description = `${entry.nickname}||${entry.studentId}`
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    search(val) {
      if (this.loading === true) return
      this.loading = true
      http
        .post('/user/query', { key: val })
        .then(res => {
          this.entries = res.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.loading = false))
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
    async save() {
      alert(form)
    }
  }
}
</script>
