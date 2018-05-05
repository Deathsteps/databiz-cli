// import request from '../request'
//
// export function requestLogin (params) {
//   return request('user/login', params)
// }

export function requestLogin(params) {
  return new Promise(function(resolve, reject) {
    // mock
    setTimeout(() => {
      // reject(new Error('登入异常！'))
      resolve({ username: params.username, token: 'dfsd456' })
    }, 500)
  });
}
