import storage from '../../common/storage'

const INITIAL_STATE = {
  isLogined: !!storage.get('token'),
  isLogining: false,
  username: '',
  token: storage.get('token') || ''
}

export function user (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case 'user/login/request':
      return {
        ...state,
        isLogining: true
      }
    case 'user/login/success':
      storage.set('token', payload.token, { expired: 3 }) // 三天过期
      return {
        ...state,
        isLogined: true,
        isLogining: false,
        ...payload
      }
    case 'user/login/failure':
      return {
        ...state,
        isLogined: false,
        isLogining: false
      }
    case 'user/logout':
      storage.remove('token')
      return {
        ...state,
        isLogined: false
      }
    default:
      return state
  }
}
