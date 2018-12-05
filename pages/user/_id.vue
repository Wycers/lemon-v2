<template lang="pug">
div 用户界面真的没做好啊
</template>
<script>
import http from '../../utils/http'
export default {
  async asyncData({ params }) {
    const res = await http.get(`/user/${params.id}`)
    return {
      id: params.id
    }
  },
  data() {},
  methods: {}
}
</script>
