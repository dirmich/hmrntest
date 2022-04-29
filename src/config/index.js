const common = {
  useLocation: false,
  useFirebase: false,
}

const dev = {
  serverURL: 'https://dev.kakaolab.ml',
}

const prod = {
  serverURL: 'https://dev.kakaolab.ml',
}
export default __DEV__ ? {...common, ...dev} : {...common, ...prod}
