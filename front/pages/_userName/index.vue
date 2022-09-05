<template>
  <div>{{metadata}}</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import Web3 from 'web3';

export default Vue.extend({
  name: 'userNameIndexPage',
  data() {
    return {
      metadata: {},

    }
  },
  async mounted() {
    if ((window as any).ethereum) {
      const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      const contract = new web3.eth.Contract(
        this.$store.state.contract.zinkaq.abi,
        this.$store.state.contract.zinkaq.address
      );
      const id = await contract.methods.getIdByUserName(this.$route.params.userName).call();
      if (id === '0') {
        this.$nuxt.context.error({
          statusCode: 404,
          message: 'Something bad happened',
        });
      }
      const url = await contract.methods.tokenURI(id).call();
      console.log(url)
      const res = await fetch(url);
      this.metadata = await res.json();
    }
    // this.connectWallet();
  },
  // methods: {
  //   ...mapActions({
  //     connectWallet: 'wallet/connectWallet',
  //   }),
  // }
})
</script>