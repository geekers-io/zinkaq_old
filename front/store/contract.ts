import { MutationTree, ActionTree } from 'vuex';
import clone from 'clone';

export type RootState = ReturnType<typeof state>

export interface ContractInformation {
  address: string;
  abi: {};
}

const zinkaqContract = require('../../blockchain/build/contracts/Zinkaq.json');

const initialState = {
  zinkaq: {
    address: '0x859827cC5974a4b9e700E83EA16DB27574c04b6E',
    abi: zinkaqContract.abi,
  },
};

export const state = () => clone(initialState);

export const mutations: MutationTree<RootState> = {
  changeZinkaqContract(state, contract: ContractInformation) {
    state.zinkaq = contract;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  setZinkaqContract({ commit }, contract) {
    commit('changeZinkaqContract', contract);
  },
}
