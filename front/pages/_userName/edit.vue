<template><div></div></template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  name: 'userNameEditPage',
  mounted() {
    console.log("AAA")
    this.$store.dispatch('wallet/connectWallet');
    // this.connectWallet();
  },
  // methods: {
  //   ...mapActions({
  //     connectWallet: 'wallet/connectWallet',
  //   }),
  // }
})
</script>