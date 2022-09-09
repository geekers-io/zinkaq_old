<template>
  <div>
    <v-list-item>
      <v-list-item-avatar
        size="100"
        class="icon"
        rounded
      >
        <img
          :src="metadata.image"
        />
      </v-list-item-avatar>
      <v-list-item-content class="ml-3">
        <div class="text-overline">
          @{{metadata.userName}}
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{metadata.displayName}}
        </v-list-item-title>
        <v-list-item-subtitle>{{address}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-container>
      <v-row class="mt-2 mb-2">
        <v-container>
          <v-menu
            bottom
            min-width="200px"
            rounded
            offset-y
            v-for="nft in certificates"
            :key="nft.id"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                x-large
                v-on="on"
              >
                <v-avatar
                  size="80"
                  class="certificates"
                >
                  <img :src="nft.rawMetadata.image" />
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <v-avatar>
                    <img :src="nft.rawMetadata.image" />
                  </v-avatar>
                  <h3>{{ nft.title }}</h3>
                  <br />
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                        <tr
                          v-for="item in [
                            {
                              title: 'token ID',
                              value: nft.tokenId
                            },
                            {
                              title: 'token type',
                              value: nft.tokenType
                            },
                            {
                              title: 'network',
                              value: nft.network
                            },
                            {
                              title: 'contract address',
                              value: nft.contract.address
                            },
                          ]"
                          :key="item.title"
                        >
                          <td>{{ item.title }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </v-container>
      </v-row>
    </v-container>

    <v-tabs
      v-model="tabs"
      fixed-tabs
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        href="#tab-1"
        class="primary--text"
      >
        Nfts
      </v-tab>

      <v-tab
        href="#tab-2"
        class="primary--text"
      >
        Transaction
      </v-tab>

      <v-tab
        href="#tab-3"
        class="primary--text"
      >
        <v-icon>mdi-account-box</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item
        v-for="i in 3"
        :key="i"
        :value="'tab-' + i"
      >
        <v-card flat>
          <div v-for="nft in nfts" :key="nft.id">
            <!-- {{nft}}
            <img :src="nft.rawMetadata.image" />
            <span>{{nft.name}}</span>
            <span>{{nft.description}}</span> -->
            <v-img
              :src="nft.rawMetadata.image"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <!-- <div v-if="checkNftInArray(nft.contract.address, nft.tokenId, selectedNft) !== undefined" class="selected">
              </div> -->
            </v-img>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    
    <!-- <div v-for="nft in nfts" :key="nft.id">
      <img :src="nft.rawMetadata.image" />
      <span>{{nft.name}}</span>
      <span>{{nft.description}}</span>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Alchemy, Network } from 'alchemy-sdk';
import Vue from 'vue';
import Web3 from 'web3';

export default Vue.extend({
  name: 'userNameIndexPage',
  data() {
    return {
      metadata: {} as any,
      certificates: [] as any[],
      nfts: [] as any[],
      address: '',
      certificate: {},
      certificateDialog: false,
      tabs: null,
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
      this.address = await contract.methods.ownerOf(id).call();
      this.address = this.address.toLowerCase();
      const url = await contract.methods.tokenURI(id).call();
      const res = await fetch(url);
      this.metadata = await res.json();
      const certificates = [];
      for (const n of this.metadata.certificate) {
        const alchemy = new Alchemy({
          network: n.network as Network,
        });
        if (await (await alchemy.nft.getOwnersForNft(n.address, n.tokenId)).owners.indexOf(this.address) > -1) {
          const metaData = await alchemy.nft.getNftMetadata(n.address, n.tokenId) as any;
          metaData.network = n.network;

          const raw = metaData.tokenUri?.raw as string;
          if (raw.match(/^data:application\/json/g)) {
            const base64 = raw;
            const json = JSON.parse(Buffer.from(base64.split(',')[1], 'base64').toString());
            metaData.rawMetadata = json;
            metaData.title = metaData.rawMetadata?.name as string;
            metaData.description = metaData.rawMetadata?.description as string;
          }
          const image = metaData.rawMetadata?.image ?? '' as string;
          if (image.match(/^ipfs:/g)) {
            metaData.rawMetadata!.image = `https://ipfs.io/ipfs/${image.split(':')[1].slice(2)}`;
          }

          certificates.push(metaData)
        }
      }
      const nft = [];
      for (const n of this.metadata.display_nft) {
        const alchemy = new Alchemy({
          network: n.network as Network,
        });
        if (await (await alchemy.nft.getOwnersForNft(n.address, n.tokenId)).owners.indexOf(this.address) > -1) {
          const metaData = await alchemy.nft.getNftMetadata(n.address, n.tokenId);
          nft.push(metaData)
        }
      }
      this.nfts = nft;
      this.certificates = certificates;
    }
  },
  methods: {
    async checkOwnNft(address: string, tokenId: string, network: string) {
      const alchemy = new Alchemy({
          network: network as Network,
        }
      );
      const owners = await (await alchemy.nft.getOwnersForNft(address, tokenId)).owners;
      return owners.indexOf(this.address) != -1;
    },
  }
})
</script>
<style lang="scss" scoped>
.icon {
  outline: 8px solid rgb(255, 255, 255);
  background-color: #fff;
  filter: drop-shadow(5px 5px 5px rgba(201, 201, 201, 0.6));
}
.certificates {
  outline: 6px solid rgb(255, 255, 255);
  background-color: #fff;
  filter: drop-shadow(5px 5px 5px rgba(201, 201, 201, 0.6));
}
</style>