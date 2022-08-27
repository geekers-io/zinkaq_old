<template>
<div>
  <button @click="connectWallet" v-if="address == ''">Connect Wallet</button>
  <input type="text" v-model="account.userName" />
  <input type="text" v-model="account.displayName" />
  <input type="text" v-model="account.bio" />
  <input type="file" @change="onImageUploaded" />
  <button @click="mint">Mint</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Web3 from 'web3';
import crypto from 'crypto';

export default Vue.extend({
  name: 'mintPage',
  data() {
    return {
      web3: {} as Web3,
      address: '',
      account: {
        userName: '',
        displayName: '',
        bio: '',
      },
      icon: {} as Buffer,
    };
  },
  async mounted() {
    await this.connectWallet();
  },
  methods: {
    async connectWallet() {
      if ((window as any).ethereum) {
        const address = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
          .then((a: any[]) => {
            return a[0];
          });
        this.address = address;
        this.web3 = new Web3((window as any).ethereum)
      }
    },
    async mint() {
      console.log(this.address)
      console.log(this.icon)
      if (!this.address) {
        this.connectWallet();
      }

      // const buf = Buffer.from(this.icon, 'base64')
      // console.log(buf)
      const imageHash = crypto.createHash('sha256').update(this.icon).digest('hex');
      console.log(imageHash)
      const signed = await this.web3.eth.personal.sign(
        imageHash,
        this.address,
        "",
      );
      console.log(signed)
      console.log(this.web3.eth.accounts.recover(imageHash, signed));

      const message = JSON.stringify(this.account);
      let hexMessage = Web3.utils.utf8ToHex(message);
      const stringSigned = await this.web3.eth.personal.sign(
        hexMessage,
        this.address,
        "",
      );
      // let hashedMessage = Web3.utils.soliditySha3(hexMessage);
      console.log(stringSigned);

      //   const contract = new this.web3.eth.Contract(
      //     this.$store.state.contract.abi,
      //     this.$store.state.contract.address,
      //   );
      //   const tx = await contract.methods.mint(this.account.userName, this.account.displayName).send({
      //     from: this.address,
      //   });
      //   console.log(tx);
      // }
    },
    async onImageUploaded(e: { target: { files: any[]; }; }) {
      // event(=e)から画像データを取得する
      const image = e.target.files[0]
      console.log(image)
      await this.createImage(image)
    },
    async createImage(image: Blob) {
      // const reader = new FileReader()
      // // imageをreaderにDataURLとしてattachする
      // reader.readAsDataURL(image)
      // // readAdDataURLが完了したあと実行される処理
      // reader.onload = () => {
      //   console.log(reader)
      //   this.icon = reader.result as string;
      // }
      const buf = await image.arrayBuffer();
      this.icon = new Buffer(buf)
    },
  }
})
</script>