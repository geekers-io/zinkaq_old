<template>
  <v-app>
    {{zinkaq}}
    <v-app-bar
      fixed
      app
      dense
      elevation="0"
      color="white"
    >
      <v-toolbar-title>Zinkaq</v-toolbar-title>
      {{walletState}}
      <v-spacer />
      <v-btn icon v-if="walletState === 'disconnected'" @click="connectWallet()">
        <v-icon>mdi-wallet</v-icon>
      </v-btn>
      <v-btn icon v-else-if="walletState === 'notHolder'" @click="$router.push('/mint')">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn icon v-else-if="walletState === 'holder'" @click="">
        {{address}}
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue'
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Contract } from 'web3-eth-contract';
  
export default Vue.extend({
  data() {
    return {
      address: '',
      walletState: '',
      provider: {} as any,
      web3: {} as Web3,
      contract: {} as Contract,
      zinkaq: {} as any,
    }
  },
  async mounted() {
    if (process.client) {
      await this.init();
      await this.connectWallet();
      await this.getZinkaq();
      this.provider.on('accountsChanged', await this.accountChange);
    }
  },
  beforeDestroy() {
    this.provider.off('accountsChanged', this.accountChange);
  },
  methods: {
    async init() {
      const provider = window.ethereum;
      this.provider = provider;
      this.web3 = new Web3(this.provider);
      this.contract = new this.web3.eth.Contract(
        this.$store.state.contract.zinkaq.abi,
        this.$store.state.contract.zinkaq.address,
      );
      await this.checkWalletState();
    },
    async connectWallet() {
      try {
        const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          this.address = accounts[0];
          this.checkWalletState();
          this.getZinkaq();
        }
      } catch (err: any) {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      }
    },
    async checkMetamaskInstalled() {
      if (this.provider) {
        return true;
      }
      return false;
    },
    async checkWalletState() {
      if (! await this.checkMetamaskInstalled()) {
        this.walletState = 'notInstalled';
        return;
      }
      if (!this.provider.isConnected()) {
        this.walletState = 'disconnected';
        return;
      } else {
        const balance = await this.contract.methods.balanceOf(this.address).call();
        if (balance > 0) {
          this.walletState = 'holder';
        } else {
          this.walletState = 'notHolder';
        }
      }
      return this.walletState;
    },
    async accountChange() {
      await this.connectWallet();
      await this.init();
    },
    async getZinkaq() {
      if (this.walletState === 'holder') {
        const ids = await this.contract.methods.getMyIds().call({from: this.address});
        console.log(ids)
      }
    },
  },
});
</script>
  