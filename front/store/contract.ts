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
    address: '0xAdb3E36B82D2c41Bcfcc0320356B3257080e5DF5',
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
