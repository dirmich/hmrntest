const {createContext} = require('react')

export const initialState = {
  show: false,
  back: false,
  title: '',
  body: '',
  isAlert: true,
  _stack: [],
  alert: () => {},
  confirm: () => {},
}

export default createContext(initialState)
