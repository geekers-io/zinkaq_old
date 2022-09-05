<template>
<div>
  <button @click="connectWallet" v-if="address == ''">Connect Wallet</button>
  <input type="text" v-model="account.userName" placeholder="userName" />
  <input type="text" v-model="account.displayName" placeholder="displayName" />
  <input type="text" v-model="account.bio" placeholder="bio" />
  <input type="file" @change="onImageUploaded" />
  <button @click="mint">Mint</button>
  <div v-for="nft in nfts" v-bind:key="nft.contract.address + nft.tokenId">
    {{nft.rawMetadata.name}}
    <!-- {{nft.rawMetadata.description}}
    {{nft.rawMetadata.external_url}} -->
    <!-- {{nft}} -->
    <img :src="nft.rawMetadata.image" class="nft_image" />
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Web3 from 'web3';
import crypto from 'crypto';
import { Network, Alchemy, OwnedNft, NftExcludeFilters } from 'alchemy-sdk';

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
        image: '',
      },
      icon: {} as Buffer,
      nfts: [] as OwnedNft[],
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
        const networks = [Network.ETH_MAINNET, Network.MATIC_MAINNET];
        for (const network of networks) {
          const alchemy = new Alchemy({
              network: network as Network,
            }
          );
          const nfts = await alchemy.nft.getNftsForOwner(address, {
            // excludeFilters: [ NftExcludeFilters.SPAM ],
          });
          this.nfts = this.nfts.concat(nfts.ownedNfts);
          console.log(nfts.totalCount)
          // const response = await alchemy.nft.getNftMetadata(
          //   "0xe51496841cd6050a6c17B81b721E60044017Ee79",
          //   "1590"
          // );
          // console.log(response);
        }

      }
      
    },
    async mint() {
      console.log(this.address)
      console.log(this.icon)
      if (!this.address) {
        this.connectWallet();
      }

      const metadataPath = '/zinkaq/metadata.json';
      const iconPath = '/zinkaq/icon.png';
      const metadataUrl = `http://localhost:8000/data/${this.address}${metadataPath}`;
      const iconUrl = `http://localhost:8000/data/${this.address}${iconPath}`;

      // Image Upload
      const imageHash = crypto.createHash('sha256').update(this.icon).digest('hex');
      const signed = await this.web3.eth.personal.sign(
        imageHash,
        this.address,
        "",
      );
      this.uploadData(this.icon, signed, iconPath);

      // Metadata Upload
      this.account.image = iconUrl;
      const message = JSON.stringify(this.account);
      const messageBuffer = Buffer.from(message);
      const messageHash = crypto.createHash('sha256').update(messageBuffer).digest('hex');
      const stringSigned = await this.web3.eth.personal.sign(
        messageHash,
        this.address,
        "",
      );
      this.uploadData(Buffer.from(message), stringSigned, metadataPath)

      const contract = new this.web3.eth.Contract(
        this.$store.state.contract.zinkaq.abi,
        this.$store.state.contract.zinkaq.address,
      );
      const tx = await contract.methods.mint(this.account.userName, metadataUrl).send({
        from: this.address,
      });
      console.log(tx)
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
    async uploadData(data: Buffer, signed: string, path: string) {
      const formData = new FormData();
      formData.append('file', new Blob([data]));
      formData.append('signature', signed);
      formData.append('file_path', path);
      return await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
    }
  }
})
</script>

<style scoped>
.nft_image {
  width: 100px;
  height: 100px;
}
</style>