import { MutationTree, ActionTree } from 'vuex';
import Web3 from 'web3';

export type RootState = ReturnType<typeof state>

export const state = () => ({
  address: '',
  web3: {} as Web3,
})

export const mutations: MutationTree<RootState> = {
  changeAddress(state, address: string) {
    state.address = address;
  },
  changeWeb3(state, web3: Web3) {
    state.web3 = web3;
  }
}

export const actions: ActionTree<RootState, RootState> = {
  setAddress({ commit }, address) {
    commit('changeAddress', address);
  },
  setWeb3({ commit }, web3) {
    commit('changeWeb3', new Web3((window as any).ethereum));
  },
}
