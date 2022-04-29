import {createContext} from 'react'

export const initialState = {
  currentPos: {},
  isRunning: false,
  setLocation: () => {},
  setIsRunning: () => {},
}

export default createContext(initialState)
