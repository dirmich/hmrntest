const {createContext} = require('react')

export const initialState = {
  isLoading: false,
  use: false,
  setIsLoading: () => {},
  setUseLoading: () => {},
}

export default createContext(initialState)
