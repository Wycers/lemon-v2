<template lang="pug">
v-card
  v-card-title
    div.title Users({{ users.length }})
    v-spacer
    v-btn(
       color="red lighten-2"
       dark
       @click="fetchUsers"
    ) Refresh
    v-dialog(v-model="dialog" v-if="isAdmin" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) Add User
      v-card
        v-card-title.headline.blue(primary-title) Add user!
        v-card-text
          v-autocomplete(
            v-model="model"
            :items="items"
            :loading="loading"
            :search-input.sync="search"
            chips
            clearable
            hide-details
            hide-selected
            item-text="Description"
            item-value="_id"
            label="Search for a user..."
            solo
            persistent-hint
            prepend-icon="mdi-city"
          )
            template(slot="no-data")
              v-list-tile
                v-list-tile-title No match

            template(slot="selection" slot-scope="{ item, selected }")
              v-chip(
                :selected="selected"
                col
              )
                v-avatar
                  img(:src="item.avatar")
                span {{ item.nickname }}
            template(slot="item" slot-scope="{ item, tile }")
              v-list-tile-avatar
                img(:src="item.avatar")
              v-list-tile-content
                v-list-tile-title {{ item.nickname }}
                v-list-tile-title {{ item._id }}
              v-list-tile-action
                v-icon mdi-coin
        v-divider
        v-card-actions
          v-spacer
          v-btn(
            color="primary"
            flat
            @click="dialog = false"
          ) cancel
          v-btn(
            color="primary"
            flat
            @click="addUser"
          ) submit
  v-list(two-line)
    template(v-for="(item, index) in users")
      v-subheader(v-if="item.header" :key="item.header") {{ item.header }} 
      v-list-tile(v-else :key="item.user._id")
        v-list-tile-avatar
          img(:src="item.user.avatar")
        v-list-tile-content
          v-list-tile-title {{ item.user.username }} {{ item.user._id }}
        v-list-tile-action
          v-btn(icon ripple @click="viewUser(item.user._id)")
            v-icon(color="info") info
        v-list-tile-action(v-if="isAdmin")
          v-btn(icon ripple @click="removeUser(item.user._id)")
            v-icon(color="red lighen-2") delete
          //- v-list-tile-sub-title(v-html="item.subtitle")
      v-divider(v-else-if="item.divider" :inset="item.inset" :key="index")
  v-snackbar(
    v-model="snackbar.model"
    :color="snackbar.color"
    right
    top
    :timeout="parseInt('3000')"
  ) {{ snackbar.text }}
    v-btn(
      dark
      flat
      @click="snackbar.model = false"
    ) Close
</template>
<script>
import http from '~/utils/http'
export default {
  props: {
    domainId: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
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
      snackbar: {
        model: false,
        text: '',
        color: 'info'
      },
      users: []
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
  created() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      http.get(`/domain/${this.domainId}/users`).then(res => {
        this.users = res.data.data
      })
    },
    viewUser(id) {
      console.log(id)
      this.$router.push(`/user/${id}`)
    },
    showSnackbar(text, color) {
      this.snackbar = {
        model: true,
        text: text,
        color: color
      }
    },
    async addUser() {
      const id = this.model
      try {
        const res = await http.put(`/domain/${this.domainId}/user`, { id: id })
        this.dialog = false
        this.showSnackbar('success', 'success')
      } catch (err) {
        this.showSnackbar('Something wrong...', 'error')
        console.log(err)
      }
    },
    async removeUser(id) {
      console.log(id)
      try {
        const res = await http.delete(`/domain/${this.domainId}/user/`, {
          data: { id }
        })
        if (res.data.success === true) {
          this.dialog = false
          this.showSnackbar('success', 'success')
        } else throw Error('rejected')
      } catch (err) {
        this.showSnackbar('Something wrong...', 'error')
        console.log(err)
      }
    }
  }
}
</script>
