<template>
  <div>{{$route.params.userName}}</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  name: 'userNameIndexPage',
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