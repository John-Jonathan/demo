import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      id: '',
      account: '',
      token: '',
    }
  },
  actions: {},
  getters: {},
})
