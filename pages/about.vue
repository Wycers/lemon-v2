<template lang="pug">
div

  h5.headline About

  //- content-placeholders(:rounded="true")
  //-   content-placeholders-img
  //-   content-placeholders-text
  h6.my-3.title Contributer
  v-layout(row wrap align-center justify-space-around)
    Gitcard(:username="'wycers'")
 
  //- v-divider

  //- h6.my-3.title Open source
  //- v-layout(row wrap)
  //-   v-flex(text-xs-center xs12 sm4 md4 lg4 xl4)
  //-     v-card.mb-3
  //-       v-layout
  //-         v-flex.my-3(xs5)
  //-           v-avatar(
  //-             :size="size"
  //-             class="grey lighten-4"
  //-             contain
  //-           )
  //-             img(src="~/static/avatar.jpg" alt="avatar")
  //-         v-flex(xs7)
  //-           v-card-title(primary-title)
  //-             div
  //-               div.my-3
  //-                 span.font-weight-light.display-1 Wycer
  //-               div.my-3
  //-                 span.contact 11711918@mail.sustc.edu.cn
  //-               div.my-3
  //-                 span.body-1 全幼儿园最可爱！
</template>
<script>
import Gitcard from '~/components/Gitcard'
export default {
  components: {
    Gitcard
  },
  computed: {
    size() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 120
        case 'sm':
          return 120
        case 'md':
          return 150
        case 'lg':
          return 180
        case 'xl':
          return 180
      }
    }
  }
}
</script>
