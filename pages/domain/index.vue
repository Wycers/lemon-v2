<template lang="pug">
div
  v-toolbar(flat dark color="primary")
    v-toolbar-title Domains
    v-spacer
    v-autocomplete(
      v-model="model"
      label="OwO..."
      :loading="loading"
      :search-input.sync="keyword"
      flat
      hide-no-data
      hide-details
      solo-inverted
    )
    v-spacer
    v-dialog(v-model="dialog" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) New domain
      v-card
        v-card-title.headline.blue(primary-title) A new domain!
        v-card-text
          v-form(ref="form" v-model="valid")
            v-text-field(
              v-model="name"
              :rules="nameRules"
              :counter="16"
              label="Name"
              required
            )
            v-radio-group(
              v-model="radio"
            )
              v-radio(
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              )
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
            @click="onSubmit"
          ) submit
  v-layout
    v-flex(text-xs-center)
      v-list(two-line)
        template(v-for="(item, index) in domains")
          v-subheader(v-if="item.header" :key="item.header") {{ item.header }}
          v-divider(v-else-if="item.divider" :inset="item.inset" :key="index") 
          v-list-tile(v-else :key="item.id" :to="`/domain/${item._id}`")
            v-list-tile-avatar
              img(:src="item.avatar")
            v-list-tile-content
              v-list-tile-title {{ item.name }}
              //- v-list-tile-sub-title(v-html="item.subtitle")
</template>
<script>
import http from '~/utils/http'
export default {
  middleware: 'auth',
  data() {
    return {
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && /[&<>"']/im.test(v) === false) || 'Invalid character'
      ],
      domains: [],
      types: [
        {
          label: '课程域',
          value: 0,
          disabled: true
        },
        {
          label: '部门域',
          value: 1,
          disabled: true
        },
        {
          label: '项目域',
          value: 2,
          disabled: false
        },
        {
          label: '活动域',
          value: 3,
          disabled: false
        }
      ],
      dialog: false,
      name: '',
      radio: 2,
      valid: true,
      loading: true,
      keyword: '',
      items: [],
      model: ''
    }
  },
  watch: {
    async keyword(val) {
      if (this.items.length > 0) return
      this.loading = true
      try {
        const data = {
          keyword: this.keyword
        }
        const res = await http.post('/domain/search', data)
        console.log(res)
      } catch (err) {
        console.err(err)
      }
      this.loading = false
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      try {
        const res = await http.get('/domain')
        this.domains = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const name = this.name
        const radio = this.radio
        try {
          const res = await http.put('/domain', { name, radio })
          this.dialog = false
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
