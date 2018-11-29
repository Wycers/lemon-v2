<template lang="pug">
v-card(list)
  div.text-xs-center.mt-3
    v-dialog(v-model="dialog" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) Add User
      v-card
        v-card-title.headline.blue(primary-title) Add user!
        v-card-text
          v-autocomplete(
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            chips
            clearable
            hide-details
            hide-selected
            label="Search for a coin..."
            solo
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
      v-list-tile(v-else :key="item.id" :to="`/user/${item._id}`")
        v-list-tile-avatar
          img(:src="item.avatar")
        v-list-tile-content
          v-list-tile-title {{ item.username }}
        v-list-tile-action
          v-btn(icon ripple)
            v-icon(color="grey lighten-1") info
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
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      select: null,
      model: null,
      search: null,
      items: []
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.queryUsers(val)
    }
  },
  methods: {
    queryUsers(v) {
      if (this.items.length > 0) return
      this.isLoading = true
      http
        .post('/user/query', { key: v })
        .then(res => {
          this.items = res.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    async addUser() {
      console.log('add')
    }
  }
}
</script>
