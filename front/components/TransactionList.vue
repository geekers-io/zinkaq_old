<template>
  <v-list-item
    class="mb-3 mx-auto"
  >
    <v-row>
      <div>
        <v-avatar
          size="72"
          color="white"
          v-if="fromMetaData && fromMetaData.image"
        >
          <v-img
            :src="fromMetaData.image"
          />
        </v-avatar>
        <v-avatar
          size="72"
          color="indigo"
          v-else
        >
          <v-icon size="72" color="white">
            mdi-account
          </v-icon>
        </v-avatar>
        <div v-if="fromMetaData.displayName" class="lineClamp">{{fromMetaData.displayName}}</div>
        <div v-else class="lineClamp">{{transaction.from}}</div>
      </div>

      <v-spacer />
      →
      <v-spacer />
      
      <div>
        <v-avatar
          size="100"
          class="icon"
          rounded
        >
          <img :src="metaData.rawMetadata?.image" />
        </v-avatar>
      </div>

      <v-spacer />
      →
      <v-spacer />

      <div>
        <v-avatar
          size="72"
          color="white"
          v-if="toMetaData && toMetaData.image"
        >
          <v-img
            :src="toMetaData.image"
          />
        </v-avatar>
        <v-avatar
          size="72"
          color="indigo"
          v-else
        >
          <v-icon size="72" color="white">
            mdi-account
          </v-icon>
        </v-avatar>
        <div v-if="toMetaData.displayName" class="lineClamp">{{toMetaData.displayName}}</div>
        <div v-else class="lineClamp">{{transaction.to}}</div>
      </div>
    </v-row>
  </v-list-item>
</template>

<script lang="ts">
  import { fetchJson } from '@ethersproject/web';
  import { Alchemy, Network } from 'alchemy-sdk';
  import Vue from 'vue';
  import Web3 from 'web3';
  
export default Vue.extend({
  name: 'TransactionList',
  data() {
    return {
      web3: {} as any,
      contract: {} as any,
      fromMetaData: {} as any,
      toMetaData: {} as any,
      nft: {} as any,
      metaData: {} as any,
    }
  },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    try {
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      this.contract = new this.web3.eth.Contract(
        this.$store.state.contract.zinkaq.abi,
        this.$store.state.contract.zinkaq.address
      );
      const fromIds = await this.contract.methods.getUserIds().call({ from: this.transaction.from });
      if (fromIds.length > 0) {
        const fromUrl = await this.contract.methods.tokenURI(fromIds[0]).call();
        this.fromMetaData = await fetchJson(fromUrl);
      }

      const toIds = await this.contract.methods.getUserIds().call({ from: this.transaction.to });
      if (toIds.length > 0) {
        const toUrl = await this.contract.methods.tokenURI(toIds[0]).call();
        this.toMetaData = await fetchJson(toUrl);
      }
    } catch (e) {
      console.log(e)
    }

    const alchemy = new Alchemy({
      network: Network.ETH_MAINNET,
    });
    this.metaData = await alchemy.nft.getNftMetadata(this.transaction.rawContract.address, this.transaction.tokenId) as any;
    console.log(this.metaData.rawMetadata.image)
  },
});
</script>
<style scoped>
  .lineClamp {
    text-align: center;
    width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>