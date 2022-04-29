import axios from './axios'

export const getToken = async token => {
  try {
    const ret = await axios.post('/token', {
      token,
    })
    return ret
  } catch (e) {
    console.log(e)
    return null
  }
}

export const setPushToken = async fcmToken => {
  axios
    .post('/pushkey', {
      push_key: fcmToken,
    })
    .then(r => {})
    .catch(e => {
      console.error('setPushToken', e)
    })
}
