<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-list two-line>
        <template v-for="(item, index) in domains">
          <v-subheader
            v-if="item.header"
            :key="item.header"
          >
            {{ item.header }}
          </v-subheader>

          <v-divider
            v-else-if="item.divider"
            :inset="item.inset"
            :key="index"
          />

          <v-list-tile
            v-else
            :key="item.title"
            :to="item.url"
            avatar
          >
            <v-list-tile-avatar>
              <img :src="item.avatar">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="item.title" />
              <v-list-tile-sub-title v-html="item.subtitle" />
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-flex>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-btn
        slot="activator"
        color="red lighten-2"
        dark
      >
        New domain
      </v-btn>
      <v-card>
        <v-card-title
          class="headline blue"
          primary-title
        >
          A new domain!
        </v-card-title>

        <v-card-text>
          <v-form ref="form"> v-model="valid">
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :counter="10"
              label="Name"
              required
            />
            <v-radio-group v-model="radioGroup">
              <v-radio
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </v-radio-group>
          </v-form>  
        </v-card-text>

        <v-divider/>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import http from '../../utils/http'
export default {
  data() {
    return {
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
      radioGroup: 2
    }
  },
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const name = this.name
        const radio = this.radioGroup
        try {
          const res = await http.post('/domain/create', { name, radio })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
