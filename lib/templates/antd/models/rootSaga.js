import { all, fork } from 'redux-saga/effects'
import userSagas from './User/saga'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all(
    [
      ...userSagas
    ].map(watcher => fork(watcher))
  )
}
