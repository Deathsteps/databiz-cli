// @flow
import { put, call, takeLatest, cancelled } from 'redux-saga/effects'

/**
 * Build a normal watcher saga for a service request
 * @param  {Function} api              service request Function
 * @param  {String} actionNamePrefix action name prefix
 * @return {Generator}                  watcher saga
 */
export function buildRequestSaga (api: Function, actionNamePrefix: string): any {
  let actions = {
    request: actionNamePrefix + '/request',
    success: actionNamePrefix + '/success',
    failure: actionNamePrefix + '/failure',
    cancel:  actionNamePrefix + '/cancel'
  }
  // worker
  function* request ({ payload }) {
    try {
      const result = yield call(api, payload)
      yield put({ type: actions.success, payload: result })
    } catch (e) {
      yield put({ type: actions.failure, payload: e })
    } finally {
      if (yield cancelled()) {
        yield put({ type: actions.cancel })
      }
    }
  }
  // watcher
  function* watchRequest (){
    yield takeLatest(actions.request, request)
  }

  return watchRequest
}

/**
 * Build normal watcher sagas for a bunch of service requests
 * @param  {Object} services      a bunch of service requests
 * @param  {String} modelName service model name
 * @return {Object}           watcher saga
 */
export function buildRequestSagas (services: Object, modelName: string): Array<*> {
  let ret = []
  for (let service in services) {
    ret.push( buildRequestSaga(services[service], `${modelName}/${service}`) )
  }
  return ret
}
