const {createContext} = require('react')

export const initialState = {
  token: null,
  user: {},
  setToken: () => {},
  setUser: () => {},
  reset: () => {},
  logout: () => {},
}

export default createContext(initialState)
