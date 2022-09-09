import { MutationTree, ActionTree } from 'vuex';

export type RootState = ReturnType<typeof state>

export const state = () => ({
  provider: {} as any,
})

export const mutations: MutationTree<RootState> = {
  changeProvider(state, provider: any) {
    state.provider = provider;
  }
}

export const actions: ActionTree<RootState, RootState> = {
  setProvider({ commit }, provider) {
    commit('changeProvider', provider);
  },
}
