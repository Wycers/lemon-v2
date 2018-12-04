<template lang="pug">
v-card(list)
  div.text-xs-center.mt-3
    v-dialog(v-model="dialog" v-if="isAdmin" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) Add User
      v-card
        v-card-title.headline.blue(primary-title) Add user!
        v-card-text
          //- div {{ items }}
          //- div {{ model }}
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
            label="Search for a coin..."
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
      v-list-tile(v-else :key="item._id")
        v-list-tile-avatar
          img(:src="item.avatar")
        v-list-tile-content(@click="test")
          v-list-tile-title {{ item.username }}
        v-list-tile-action
          v-btn(icon ripple)
            v-icon(
              color="info"
              @click="view(item._id)"
            ) info
        v-list-tile-action(v-if="isAdmin")
          v-btn(icon ripple)
            v-icon(
              color="red lighen-2"
              @click="remove(item._id)"
            ) delete
          //- v-list-tile-sub-title(v-html="item.subtitle")
      v-divider(v-else-if="item.divider" :inset="item.inset" :key="index")

</template>
<script>
import http from '../../utils/http'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    users: {
      type: Array,
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
      entries: []
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
    test() {
      alert('clcik')
    },
    view(id) {
      this.$router.push(`/user/${id}`)
    },
    async addUser() {
      id = this.model
      try {
        const res = await http.put('/domain/user', { id })
      } catch (err) {
        console.log(err)
      }
    },
    async delete(id) {
      try {
        const res = await http.delete('/domain/user', { id })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
