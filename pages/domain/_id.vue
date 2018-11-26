<template lang="pug">
  div {{ domain }}
</template>

<script>
import http from '../../utils/http'
export default {
  async asyncData({ params }) {
    const res = await http.get(`/domain/${params.id}`)
    return {
      domain: res.data
    }
  }
}
</script>
