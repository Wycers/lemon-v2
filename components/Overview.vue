<template lang="pug">
v-card
  v-card-title
    div.title Overview
    v-spacer
    v-btn(
      color="red lighten-2"
      dark
    ) Save
  v-card-text
    slot
    div {{ eventType }}
</template>
<script>
export default {
  props: {
    eventType: {
      type: String,
      required: true
    },
    eventId: {
      type: String,
      required: true
    }
  }
}
</script>
