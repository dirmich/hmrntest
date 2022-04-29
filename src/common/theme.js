import {Dimensions} from 'react-native'

const {width, height} = Dimensions.get('window')

export const COLORS = {
  primary: '#fc6d3f',
  secondary: '#cdcdd2',

  black: '#1e1f20',
  white: '#ffffff',

  lightGray1: '#f5f5f6',
  lightGray2: '#f6f6f7',
  lightGray3: '#efeff1',
  lightGray4: '#f8f8f9',

  chatMe: '#ffbb00',
  chatOther: '#bbff00',
  darkGray: '#898c95',
}

export const SIZES = {
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  title: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,

  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
  width,
  height,
}

export const FONTS = {
  title: {fontSize: SIZES.title, lineHeight: 60},
  h1: {fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontSize: SIZES.h4, lineHeight: 22},
  body1: {fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontSize: SIZES.body5, lineHeight: 22},
}

const theme = {COLORS, SIZES, FONTS}

export default theme
