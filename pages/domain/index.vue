<template lang="pug">
  v-layout
    v-flex(text-xs-center)
      v-list(two-line)
        template(v-for="(item, index) in domains")
          v-subheader(v-if="item.header" :key="item.header") {{ item.header }}
          v-divider(v-else-if="item.divider" :inset="item.inset" :key="index") 
          v-list-tile(v-else :key="item.id" :to="`/domain/${item.id}`")
            //- v-list-tile-avatar
            //-   img(:src="item.avatar")
            v-list-tile-content
              v-list-tile-title(v-html="item.name")
              //- v-list-tile-sub-title(v-html="item.subtitle")
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
</template>
<script>
import http from '../../utils/http'
export default {
  data() {
    return {
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && /[&<>"']/im.test(v) === false) || 'Invalid character'
      ],
      domains: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          url: '/domain/1',
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          url: '/domain/2',
          subtitle:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          url: '/domain/3',
          subtitle:
            "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ],
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
      valid: true
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await http.get('/domain')
      this.domains = res.data
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
