<template>
<div>
  <!-- <v-form> -->
    <v-btn @click="connectWallet" v-if="address == ''">Connect Wallet</v-btn>
    <v-text-field type="text" v-model="account.userName" placeholder="userName" />
    <v-text-field type="text" v-model="account.displayName" placeholder="displayName" />
    <v-text-field type="text" v-model="account.bio" placeholder="bio" />
    <input type="file" @change="onImageUploaded" />
    <v-btn @click="mint">Mint</v-btn>
  <!-- </v-form> -->

  <v-row justify="end">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Add NFTs
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field type="text" v-model="nftInformation.address" placeholder="address" />
            </v-row>
            <v-row>
              <v-text-field type="text" v-model="nftInformation.tokenId" placeholder="tokenId" />
            </v-row>
            <v-row>
              <v-select
                :items="[{
                  text: 'Ethereum',
                  value: 'eth-mainnet',
                }, {
                  text: 'Polygon',
                  value: 'polygon-mainnet',
                }]"
                filled
                label="Filled style"
                v-model="nftInformation.network"
              />
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addContract"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <!-- <input type="text" v-model="nftInformation.address" placeholder="address" />
    <input type="text" v-model="nftInformation.tokenId" placeholder="tokenId" />
    <select name="network" v-model="nftInformation.network">
      <option value="eth-mainnet" default>Ethereum</option>
      <option value="polygon-mainnet">Polygon</option>
    </select>
    <button @click="addContract">Add</button> -->

  <v-dialog
    v-model="informationDialog"
    width="600"
  >
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="5">
              <v-avatar
                class="ma-3"
                size="180"
                tile
              >
                <v-img :src="informationNft.rawMetadata.image" />
              </v-avatar>
            </v-col>

            <v-col cols="7">
              <v-row class="text-h6">{{informationNft.rawMetadata.name}}</v-row>
              <v-row>{{informationNft.tokenId}}</v-row>
              <v-row>{{informationNft.rawMetadata.description}}</v-row>
              <v-row>Contract:</v-row>
              <v-row>{{informationNft.contract.address}}</v-row>
              <v-row>{{informationNft.network}}</v-row>
              <v-row>{{informationNft.tokenType}}</v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="informationDialog = false"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row>
    <v-col
      v-for="nft in nfts"
      :key="nft.contract.address + nft.tokenId"
      class="d-flex child-flex relative"
      cols="4"
    >
      <div class="button_area">
        <v-btn
          icon
          color="blue lighten-1"
          @click="informationDialog = true; informationNft = nft"
        >
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>

        <v-btn
          icon
          :color="checkNftInArray(nft.contract.address, nft.tokenId, certificateNft) === undefined ? 'gray' : 'orange'"
          @click="clickCertificateImage(nft.contract.address, nft.tokenId, nft.network)"
        >
          <v-icon>mdi-certificate</v-icon>
        </v-btn>
      </div>
      <v-img
        :src="nft.rawMetadata.image"
        aspect-ratio="1"
        class="grey lighten-2"
        @click="clickImage(nft.contract.address, nft.tokenId, nft.network)"
      >
        <div v-if="checkNftInArray(nft.contract.address, nft.tokenId, selectedNft) !== undefined" class="selected">
        </div>
      </v-img>
    </v-col>
  </v-row>

  <!-- <div v-for="nft in nfts" v-bind:key="nft.contract.address + nft.tokenId">
    {{nft.rawMetadata.image}}
    <div>
      {{nft.title}}
      <img :src="nft.rawMetadata.image" class="nft_image" />
      <div @click="clickImage(nft.contract.address, nft.tokenId, nft.network)">
        <span v-if="checkNftInArray(nft.contract.address, nft.tokenId, selectedNft) === undefined">
          リスト追加
        </span>
        <span v-else>
          リスト削除
        </span>
      </div>
      <div @click="clickCertificateImage(nft.contract.address, nft.tokenId, nft.network)">
        <span v-if="checkNftInArray(nft.contract.address, nft.tokenId, certificateNft) === undefined">
          証明に追加
        </span>
        <span v-else>
          証明から削除
        </span>
      </div>
    </div>
  </div> -->
  <!-- <div v-for="nft in nfts" v-bind:key="nft.contract.address + nft.tokenId">
    <div @click="clickCertificateImage(nft.contract.address, nft.tokenId)">
      {{nft.rawMetadata.name}}
      <img :src="nft.rawMetadata.image" class="nft_image" />
    </div>
  </div> -->
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Web3 from 'web3';
import crypto from 'crypto';
import { Network, Alchemy, OwnedNft, NftExcludeFilters, NftMetadata, BaseNftContract } from 'alchemy-sdk';

interface selectedNft {
  address: string;
  tokenId: string;
  network: string;
}

interface NftData {
  contract: BaseNftContract;
  tokenId: string;
  rawMetadata: NftMetadata | undefined;
}

export default Vue.extend({
  name: 'mintPage',
  data() {
    return {
      dialog: false,
      web3: {} as Web3,
      address: '',
      account: {
        userName: '',
        displayName: '',
        bio: '',
        image: '',
        certificate: [] as selectedNft[],
        display_nft: [] as selectedNft[],
      },
      icon: {} as Buffer,
      nfts: [] as NftData[],
      selectedNft: [] as selectedNft[],
      certificateNft: [] as selectedNft[],
      contractAddress: '',
      tokenId: '',
      nftInformation: {
        address: '',
        tokenId: '',
        network: "eth-mainnet",
      },
      informationNft: {
        contract: { address: '' },
        tokenId: '',
        network: '',
        tokenType: '',
        rawMetadata: { name: '', description: '', image: '' },
      },
      informationDialog: false,
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
          this.nfts = this.nfts.concat(nfts.ownedNfts.map((nft) => {
            const raw = nft.tokenUri?.raw as string;
            if (raw.match(/^data:application\/json/g)) {
              const base64 = raw;
              const json = JSON.parse(Buffer.from(base64.split(',')[1], 'base64').toString());
              nft.rawMetadata = json;
              nft.title = nft.rawMetadata?.name as string;
              nft.description = nft.rawMetadata?.description as string;
            }
            const image = nft.rawMetadata?.image ?? '' as string;
            if (image.match(/^ipfs:/g)) {
              nft.rawMetadata!.image = `https://ipfs.io/ipfs/${image.split(':')[1].slice(2)}`;
            }
            return {
              ...nft,
              network: network,
            };
          }));
          // const response = await alchemy.nft.getNftMetadata(
          //   "0xe51496841cd6050a6c17B81b721E60044017Ee79",
          //   "1590"
          // );
          // console.log(response);
        }

      }
      
    },
    async mint() {
      if (!this.address) {
        this.connectWallet();
      }

      const metadataPath = '/zinkaq/metadata.json';
      const iconPath = '/zinkaq/icon.png';
      const metadataUrl = `http://localhost:8000/data/${this.address}${metadataPath}`;
      const iconUrl = `http://localhost:8000/data/${this.address}${iconPath}`;

      // Image Signed
      const imageHash = crypto.createHash('sha256').update(this.icon).digest('hex');
      const signed = await this.web3.eth.personal.sign(
        imageHash,
        this.address,
        "",
      );

      // Metadata Signed
      this.account.image = iconUrl;
      this.account.certificate = this.certificateNft;
      this.account.display_nft = this.selectedNft;
      const message = JSON.stringify(this.account);
      const messageBuffer = Buffer.from(message);
      const messageHash = crypto.createHash('sha256').update(messageBuffer).digest('hex');
      const stringSigned = await this.web3.eth.personal.sign(
        messageHash,
        this.address,
        "",
      );

      // Upload
      this.uploadData(this.icon, signed, iconPath);
      this.uploadData(Buffer.from(message), stringSigned, metadataPath)

      const contract = new this.web3.eth.Contract(
        this.$store.state.contract.zinkaq.abi,
        this.$store.state.contract.zinkaq.address,
      );
      const tx = await contract.methods.mint(this.account.userName, metadataUrl).send({
        from: this.address,
      });
      console.log(tx)
      this.$router.push(`/${this.account.userName}`);
    },
    async onImageUploaded(e: { target: { files: any[]; }; }) {
      const image = e.target.files[0]
      await this.createImage(image)
    },
    async createImage(image: Blob) {
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
    },
    clickImage(address: string, tokenId: string, network: string) {
      if (this.checkNftInArray(address, tokenId, this.selectedNft)) {
        this.selectedNft = this.selectedNft.filter((nft) => !(nft.address === address && nft.tokenId === tokenId));
      } else {
        this.selectedNft.push({ address, tokenId, network });
      }
    },
    clickCertificateImage(address: string, tokenId: string, network: string) {
      if (this.checkNftInArray(address, tokenId, this.certificateNft)) {
        this.certificateNft = this.certificateNft.filter((nft) => !(nft.address === address && nft.tokenId === tokenId));
      } else {
        this.certificateNft.push({ address, tokenId, network });
      }
    },
    checkNftInArray(address: string, tokenId: string, array: selectedNft[]) {
      return array.find((nft) => nft.address === address && nft.tokenId === tokenId);
    },
    async addContract() {
      const alchemy = new Alchemy({
        network: this.nftInformation.network as Network,
      });
      alchemy.nft.getNftMetadata(
        this.nftInformation.address,
        this.nftInformation.tokenId,
      ).then((nfts) => {
        const base64 = nfts.tokenUri?.raw.match(/^[data:application/\json].*$/g) as string[];
        if (base64.length != 0) {
          const json = JSON.parse(Buffer.from(base64[0].split(',')[1], 'base64').toString());
          this.nfts.push({
            rawMetadata: json,
            tokenId: this.nftInformation.tokenId,
            contract: { address: this.nftInformation.address },
          });
        }
        this.dialog = false;
      });
    },
  }
})
</script>

<style scoped>
.nft_image {
  width: 100px;
  height: 100px;
}

.selected {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  /* border: 10px solid rgb(10, 249, 66); */
  background-color: #000;
  opacity: 0.5;
}

.button_area {
  position: absolute;
  z-index: 1;
}

.relative {
  position: relative;
}

.card_area {
  margin: 24px 20px
}
</style>