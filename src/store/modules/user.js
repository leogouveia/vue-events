export const state = {
  user: {
    id: 'abc123',
    name: 'Adam'
  }
}

export const getters = {
  getUser: state => state.user
}
