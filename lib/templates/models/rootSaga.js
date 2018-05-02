// import { all, fork } from 'redux-saga/effects'
// import homeSagas from './Home/saga'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield "done"
  // yield all(
  //   [].map(watcher => fork(watcher))
  // )
}
