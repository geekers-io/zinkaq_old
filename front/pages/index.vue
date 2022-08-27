<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  mounted() {
    console.log(this.$store.state.wallet.address);
  },
})
</script>
