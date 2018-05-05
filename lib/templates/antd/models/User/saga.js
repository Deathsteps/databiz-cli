import { requestLogin } from './service'
import { push } from 'react-router-redux'
import { put, take, call, fork } from 'redux-saga/effects'

// worker
function* login({ from, ...loginParams }) {
  try {
    const result = yield call(requestLogin, loginParams)
    yield put({ type: 'user/login/success', payload: result })
    yield put(push(from))
  } catch (err) {
    yield put({ type: 'user/login/failure', payload: err })
  } finally {
    // TODO: canceling
  }
}

// watcher
function* watchLogInOut() {
  while (true) {
    const { payload } = yield take('user/login/request')
    // It has to be fork here, because call is a blocking action.
    // And the failure in the call action will not be catched
    // by the following take action
    yield fork(login, payload)
    // logout or login/failure will continue the loop
    yield take(['user/logout', 'user/login/failure'])
    // private route will redirect the page to /user/login
  }
}

export default [ watchLogInOut ]
